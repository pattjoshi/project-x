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

Phase 3 (require `Authorization: Bearer <access_token>`):
- `GET /api/relationships/{character_id}` — current relationship state (creates one on first call)
- `POST /api/chat/{character_id}` — `{ message }` → `{ reply, emotion, intent, relationship }`

Chat pipeline: moderate user message → generate structured reply (LangChain +
OpenAI, `{ reply, emotion, intent }`) → moderate the reply → apply score rules
in plain Python (`app/game/score_rules.py`) → persist both messages. The model
never sets scores directly.
