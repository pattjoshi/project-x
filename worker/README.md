# worker

CrewAI background jobs, run via ARQ against the shared Postgres/Redis. Per
the architecture rule: **LangGraph = live (backend), CrewAI = background
(this container)**.

This package deliberately does *not* import the backend's SQLModel models -
they're separate deployable units. It reads/writes the shared database with
small raw-SQL helpers in `core/db.py` instead of duplicating the full ORM.

```bash
cd worker
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
arq tasks.WorkerSettings
```

## Crews

- **Compatibility Report Crew** (`crews/compatibility_report.py`) - user-facing.
  `POST /api/reports/{character_id}` (backend) enqueues a job; this crew
  writes a short weekly-style note in the character's voice reflecting on
  the relationship (stage, scores, memory summary), reviewed by a second
  "safety" agent for tone/content before being saved to `jobs.output`.
- **Character Creator Crew** (`crews/character_creator.py`) - admin/dev tool,
  not exposed via the API (no admin auth exists yet). Run directly:

  ```bash
  python -m scripts.run_character_creator "a cheerful barista from Pune who loves kathak dance"
  ```

  Prints a full character profile (reviewed for 18+/non-explicit) for a
  human to review and add to `backend/scripts/seed_characters.py` by hand.

Both crews use `Process.sequential`: a writer agent drafts, a reviewer agent
checks it against the app's content policy before the result is used.
