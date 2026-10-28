import uuid

from sqlmodel import Field, SQLModel


class ChapterProgress(SQLModel, table=True):
    __tablename__ = "chapter_progress"

    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True)
    chapter_id: uuid.UUID = Field(foreign_key="chapters.id", primary_key=True)

    current_node: str
    completed: bool = Field(default=False)
