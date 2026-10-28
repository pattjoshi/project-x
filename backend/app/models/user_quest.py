import uuid
from datetime import date

from sqlmodel import Field, SQLModel


class UserQuest(SQLModel, table=True):
    __tablename__ = "user_quests"

    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True)
    quest_id: uuid.UUID = Field(foreign_key="quests.id", primary_key=True)
    quest_date: date = Field(primary_key=True)

    progress: int = Field(default=0)
    completed: bool = Field(default=False)
