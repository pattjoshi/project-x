import uuid

from pydantic import BaseModel


class OverviewStats(BaseModel):
    total_users: int
    total_messages: int
    total_gifts_sent: int
    stage_counts: dict[str, int]


class ChapterDropOff(BaseModel):
    chapter_id: uuid.UUID
    chapter_title: str
    started: int
    completed: int


class NodeDropOff(BaseModel):
    chapter_id: uuid.UUID
    chapter_title: str
    node_id: str
    stuck_count: int


class ChoiceStat(BaseModel):
    chapter_id: uuid.UUID
    chapter_title: str
    node_id: str
    choice: str
    count: int


class UserCost(BaseModel):
    user_id: uuid.UUID
    display_name: str
    message_count: int
    prompt_tokens: int
    completion_tokens: int
    estimated_cost_usd: float


class CostSummary(BaseModel):
    total_estimated_cost_usd: float
    top_users: list[UserCost]
