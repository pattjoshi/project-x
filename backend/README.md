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
```

## Endpoints

Phase 2:
- `POST /api/auth/register` — `{ email, password, display_name, timezone, age_confirmed }` → `{ user, access_token }`
- `POST /api/auth/login` — `{ email, password }` → `{ user, access_token }`
- `GET /api/characters` — list characters
- `GET /api/characters/{id}` — character detail

Phase 3/4/5 (require `Authorization: Bearer <access_token>`):
- `GET /api/relationships/{character_id}` — current relationship state (creates one on first call)
- `POST /api/chat/{character_id}` — `{ message }` → `{ reply, emotion, intent, relationship, stage_changed }`
- `GET /api/chapters/{character_id}` — chapters unlocked for the current user (`relationship.stage >= chapter.unlock_stage`)
- `GET /api/chapters/{character_id}/{chapter_id}` — current node (creates progress at the chapter's start node on first visit)
- `POST /api/chapters/{character_id}/{chapter_id}/choose` — `{ choice_index }` → next node, with scores applied from the choice's `score_delta` (no AI involved — these are author-written, not model-generated)

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
