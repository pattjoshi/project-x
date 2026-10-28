import uuid

from sqlmodel import Field, SQLModel


class Relationship(SQLModel, table=True):
    __tablename__ = "relationships"

    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True)
    character_id: uuid.UUID = Field(foreign_key="characters.id", primary_key=True)

    affection: int = Field(default=0)
    trust: int = Field(default=0)
    chemistry: int = Field(default=0)
    stage: str = Field(default="stranger")
    mood: str = Field(default="neutral")
    memory_summary: str = Field(default="")
