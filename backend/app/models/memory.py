import uuid
from datetime import datetime, timezone

from pgvector.sqlalchemy import Vector
from sqlmodel import Field, SQLModel

from app.core.config import get_settings


class Memory(SQLModel, table=True):
    __tablename__ = "memories"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    character_id: uuid.UUID = Field(foreign_key="characters.id")
    text: str
    embedding: list[float] = Field(
        sa_type=Vector(get_settings().openai_embedding_dimensions)
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
