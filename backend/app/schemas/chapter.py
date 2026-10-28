import uuid

from pydantic import BaseModel

from app.schemas.chat import RelationshipPublic


class ChapterSummary(BaseModel):
    id: uuid.UUID
    title: str
    completed: bool


class ChapterNodeResponse(BaseModel):
    chapter_id: uuid.UUID
    node_id: str
    text: str
    choices: list[str]
    ending: bool
    relationship: RelationshipPublic
    stage_changed: bool = False


class ChoiceRequest(BaseModel):
    choice_index: int
