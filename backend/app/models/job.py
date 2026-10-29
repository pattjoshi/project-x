import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON
from sqlmodel import Field, SQLModel


class Job(SQLModel, table=True):
    """A background CrewAI job. `type` names the crew (e.g.
    'compatibility_report'); `input`/`output` are small JSON payloads."""

    __tablename__ = "jobs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    type: str
    status: str = Field(default="pending")
    input: dict = Field(sa_type=JSON)
    output: dict | None = Field(default=None, sa_type=JSON)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
