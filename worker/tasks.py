from arq.connections import RedisSettings
from sqlalchemy import text

from core.config import get_settings
from core.db import fetch_character, fetch_relationship, get_engine, update_job
from crews.compatibility_report import generate_compatibility_report


def _fetch_job_input(job_id: str) -> dict:
    with get_engine().connect() as conn:
        row = conn.execute(
            text("SELECT input FROM jobs WHERE id = :id"), {"id": job_id}
        ).mappings().one()
    return row["input"]


async def generate_compatibility_report_task(ctx, job_id: str) -> None:
    job_input = _fetch_job_input(job_id)
    character = fetch_character(job_input["character_id"])
    relationship = fetch_relationship(job_input["user_id"], job_input["character_id"])

    try:
        report = generate_compatibility_report(
            character_name=character["name"],
            personality_prompt=character["personality_prompt"],
            stage=relationship["stage"],
            affection=relationship["affection"],
            trust=relationship["trust"],
            chemistry=relationship["chemistry"],
            memory_summary=relationship["memory_summary"],
        )
        update_job(job_id, status="completed", output={"report": report})
    except Exception as exc:  # noqa: BLE001 - surface any failure on the job row
        update_job(job_id, status="failed", output={"error": str(exc)})


class WorkerSettings:
    functions = [generate_compatibility_report_task]
    redis_settings = RedisSettings.from_dsn(get_settings().redis_url)
