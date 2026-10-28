import uuid

from sqlmodel import Field, SQLModel


class Quest(SQLModel, table=True):
    """A quest template (e.g. "send 3 messages"). One row per quest type,
    seeded once - the daily instance is UserQuest."""

    __tablename__ = "quests"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    type: str = Field(unique=True)
    target: int
    reward: str
