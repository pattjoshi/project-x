import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, SessionDep
from app.core.queue import get_arq_pool
from app.game.relationships import get_or_create_relationship
from app.models.character import Character
from app.models.job import Job
from app.schemas.report import JobPublic

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/{character_id}", response_model=JobPublic, status_code=status.HTTP_202_ACCEPTED)
async def request_compatibility_report(
    character_id: uuid.UUID, current_user: CurrentUser, session: SessionDep
) -> JobPublic:
    if session.get(Character, character_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found.")

    # ensures a relationship row exists so the worker has something to read
    get_or_create_relationship(session, current_user.id, character_id)

    job = Job(
        type="compatibility_report",
        input={"user_id": str(current_user.id), "character_id": str(character_id)},
    )
    session.add(job)
    session.commit()
    session.refresh(job)

    pool = await get_arq_pool()
    await pool.enqueue_job("generate_compatibility_report_task", str(job.id))

    return JobPublic(id=job.id, type=job.type, status=job.status, output=job.output)


@router.get("/jobs/{job_id}", response_model=JobPublic)
def get_report_job(job_id: uuid.UUID, current_user: CurrentUser, session: SessionDep) -> JobPublic:
    job = session.get(Job, job_id)
    if job is None or job.input.get("user_id") != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")

    return JobPublic(id=job.id, type=job.type, status=job.status, output=job.output)
