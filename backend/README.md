# backend

FastAPI service. Run via the root `docker-compose.yml`, or locally:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --port 8080 --reload
```

## Migrations

```bash
alembic upgrade head
alembic revision --autogenerate -m "message"   # for new changes
```

## Seed data

Populate placeholder characters and their chapters for local UI testing:

```bash
python -m scripts.seed_characters
python -m scripts.seed_chapters
python -m scripts.seed_quests
python -m scripts.seed_gifts
```

## Endpoints

Phase 2:
- `POST /api/auth/register` — `{ email, password, display_name, timezone, age_confirmed }` → `{ user, access_token }`
- `POST /api/auth/login` — `{ email, password }` → `{ user, access_token }`
- `GET /api/characters` — list characters
- `GET /api/characters/{id}` — character detail

Phase 3/4/5/6 (require `Authorization: Bearer <access_token>`):
- `GET /api/relationships/{character_id}` — current relationship state (creates one on first call)
- `POST /api/chat/{character_id}` — `{ message }` → `{ reply, emotion, intent, relationship, stage_changed }`
- `GET /api/chapters/{character_id}` — chapters unlocked for the current user (`relationship.stage >= chapter.unlock_stage`)
- `GET /api/chapters/{character_id}/{chapter_id}` — current node (creates progress at the chapter's start node on first visit)
- `POST /api/chapters/{character_id}/{chapter_id}/choose` — `{ choice_index }` → next node, with scores applied from the choice's `score_delta` (no AI involved — these are author-written, not model-generated)
- `GET /api/daily` — login streak + today's 3 quests, lazily bootstrapped (see below)

Phase 8 (require `Authorization: Bearer <access_token>`):
- `POST /api/reports/{character_id}` → `202` + `{ id, status: "pending" }`, enqueues a background job on the worker (see `../worker/README.md`)
- `GET /api/reports/jobs/{job_id}` — poll for the result (`{ status, output }`); 404 if the job doesn't belong to the current user

Phase 10a (gifts):
- `GET /api/gifts` — list the gift catalog (public, no auth required)
- `POST /api/gifts/{character_id}/{gift_id}` — requires `Authorization: Bearer <access_token>`; looks up each character's `likes`/`dislikes` to classify the gift as `loved`/`liked`/`disliked` (`app/game/gifts.py`), applies the matching affection/trust/chemistry deltas, logs the send to `gift_log`, and returns `{ affinity, relationship }`

Phase 10d (voice, require `Authorization: Bearer <access_token>`):
- `GET /api/chat/{character_id}/messages/{message_id}/speech` → `audio/mpeg`; synthesizes the given assistant message via OpenAI TTS (`app/core/tts.py`, model/voice set by `OPENAI_TTS_MODEL`/`OPENAI_TTS_VOICE`, default `tts-1`/`nova`). 404s unless the message belongs to the current user, the given character, and has `role == "assistant"`. Generated on demand, not cached or stored — each play is a fresh OpenAI call, so this adds real per-play cost/latency on top of the chat completion; worth revisiting (e.g. caching by message id) before this goes to real users at scale.

Phase 10b (admin analytics, require `Authorization: Bearer <access_token>` from a user with `is_admin = true` — 403 otherwise):
- `GET /api/admin/analytics/overview` — total users/messages/gifts sent, relationship counts by stage
- `GET /api/admin/analytics/chapter-dropoff` — per-chapter started vs. completed counts (`app/models/chapter_progress.py`)
- `GET /api/admin/analytics/node-dropoff` — top nodes where incomplete chapter runs are currently stuck
- `GET /api/admin/analytics/choices` — most-picked chapter choices, grouped by chapter/node/choice
- `GET /api/admin/analytics/cost` — estimated AI spend per user, from chat-completion token usage captured on each `Message` (`prompt_tokens`/`completion_tokens`, added in migration `0008`) at fixed gpt-4o-mini pricing (`app/game/analytics.py`). This is an *estimate* from the tracked chat-completion calls only — moderation and TTS calls aren't metered here, so treat it as directional, not a bill.

There's no self-serve way to become an admin (by design — this is a first-pass internal dashboard, not a role a user can grant themselves): promote an account with `python -m scripts.make_admin someone@example.com` (`--revoke` to undo).

## Chat pipeline (`app/graphs/chat_graph.py`)

A LangGraph `StateGraph` (invoked fresh per request — no checkpointer; the
database is the single source of truth for relationship/mood state, not graph
state):

```
moderate_input ──(flagged)──→ refuse ──→ END
   │ (clean)
   ▼
load_memory (relationship.memory_summary + top-5 pgvector cosine-similarity
             matches from app/models/memory.py)
   ▼
generate (LangChain ChatOpenAI.with_structured_output → { reply, emotion, intent })
   ▼
moderate_output ──(flagged)──→ apply_scores (no-op, intent forced to neutral) ──→ END
   │ (clean)
   ▼
apply_scores (plain Python, app/game/score_rules.py — the model never sets
              scores directly; also derives mood from intent and the new
              relationship stage)
   ▼
store_memory (embed + store this exchange; roll the ~200-word summary forward)
   ▼
END
```

`stage_changed` in the response tells the frontend when the relationship
crossed a stage threshold (stranger → friend → close → dating), for a toast/
banner.

## Chapters (`app/game/chapters.py`, `app/stories/`)

Scripted content, separate from the free-chat graph above. Each chapter is a
small branching dialogue tree stored as JSON under `stories/<slug>/` (see
`stories/README.md` for the format), with metadata (title, `unlock_stage`,
`status`) in the `chapters` table. A chapter unlocks once
`relationship.stage` reaches its `unlock_stage`. Choices carry an
author-written `score_delta` applied directly — no AI in this path at all.
Progress (`chapter_progress`) and a full choice history (`choices_log`) are
tracked per user per chapter.

## Daily quests & streaks (`app/game/daily.py`)

No cron job — "lazy" generation per the plan: the first authenticated request
of the day (via `GET /api/daily`) compares `user.last_active_date` (in the
user's own `timezone`) to today, rolls the login streak forward (or resets it
to 1 if a day was missed), and creates today's `UserQuest` rows from the
fixed `quests` catalog (seeded once via `scripts.seed_quests`). `record_progress`
is called from the chat and chapter routes to increment the matching quest
(`chat_messages`, `chapter_choice`, `level_up`) as the user plays, capped at
each quest's `target`. Rewards are currently descriptive text only — no
score-mechanical effect yet.

## Background jobs (`app/core/queue.py`, `app/models/job.py`)

A `jobs` row (`type`, `status`, `input`, `output`) is created and an ARQ job
is enqueued on the same Redis the worker container listens on - the API
returns immediately with `status: "pending"`; the frontend polls
`GET /api/reports/jobs/{job_id}` until it flips to `completed`/`failed`. See
`../worker/README.md` for what runs on the other end.
