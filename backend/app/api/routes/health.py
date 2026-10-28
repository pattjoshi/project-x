from fastapi import APIRouter
from sqlmodel import text

from app.api.deps import SessionDep

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/db")
def health_check_db(session: SessionDep) -> dict[str, str]:
    session.exec(text("SELECT 1"))
    return {"status": "ok"}
