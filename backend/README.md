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
alembic revision --autogenerate -m "message"
alembic upgrade head
```
