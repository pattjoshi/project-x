import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON
from sqlmodel import Field, SQLModel


class ChoiceLog(SQLModel, table=True):
    __tablename__ = "choices_log"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    chapter_id: uuid.UUID = Field(foreign_key="chapters.id")
    node_id: str
    choice: str
    score_delta: dict[str, int] = Field(sa_type=JSON)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
