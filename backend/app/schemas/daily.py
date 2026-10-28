import uuid

from pydantic import BaseModel


class StreakPublic(BaseModel):
    current: int
    longest: int


class QuestPublic(BaseModel):
    id: uuid.UUID
    title: str
    type: str
    target: int
    progress: int
    completed: bool
    reward: str


class DailyStateResponse(BaseModel):
    streak: StreakPublic
    quests: list[QuestPublic]
