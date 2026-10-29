import json

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

from core.config import get_settings

_engine: Engine | None = None


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        _engine = create_engine(get_settings().database_url)
    return _engine


def fetch_character(character_id: str) -> dict:
    with get_engine().connect() as conn:
        row = conn.execute(
            text(
                "SELECT name, personality_prompt, lore FROM characters WHERE id = :id"
            ),
            {"id": character_id},
        ).mappings().one()
        return dict(row)


def fetch_relationship(user_id: str, character_id: str) -> dict:
    with get_engine().connect() as conn:
        row = conn.execute(
            text(
                "SELECT affection, trust, chemistry, stage, mood, memory_summary "
                "FROM relationships WHERE user_id = :user_id AND character_id = :character_id"
            ),
            {"user_id": user_id, "character_id": character_id},
        ).mappings().one()
        return dict(row)


def update_job(job_id: str, status: str, output: dict | None = None) -> None:
    with get_engine().begin() as conn:
        conn.execute(
            text(
                "UPDATE jobs SET status = :status, "
                "output = CAST(:output AS JSON) WHERE id = :id"
            ),
            {
                "status": status,
                "output": json.dumps(output) if output is not None else None,
                "id": job_id,
            },
        )
