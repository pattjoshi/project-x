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

Populate 2-3 placeholder characters for local UI testing:

```bash
python -m scripts.seed_characters
```

## Endpoints

Phase 2:
- `POST /api/auth/register` — `{ email, password, display_name, timezone, age_confirmed }` → `{ user, access_token }`
- `POST /api/auth/login` — `{ email, password }` → `{ user, access_token }`
- `GET /api/characters` — list characters
- `GET /api/characters/{id}` — character detail

Phase 3/4 (require `Authorization: Bearer <access_token>`):
- `GET /api/relationships/{character_id}` — current relationship state (creates one on first call)
- `POST /api/chat/{character_id}` — `{ message }` → `{ reply, emotion, intent, relationship, stage_changed }`

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
banner — no chapter/quest unlocks exist yet (Phases 5/6).
