import uuid

from sqlmodel import Field, SQLModel


class Chapter(SQLModel, table=True):
    """Metadata for a scripted chapter; the node graph itself lives in the
    JSON file at `script_ref` (relative to `backend/stories/`)."""

    __tablename__ = "chapters"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    character_id: uuid.UUID = Field(foreign_key="characters.id")
    title: str
    unlock_stage: str = Field(default="stranger")
    script_ref: str
    status: str = Field(default="draft")
