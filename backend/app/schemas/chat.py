import uuid

from pydantic import BaseModel, ConfigDict


class ChatRequest(BaseModel):
    message: str


class RelationshipPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    affection: int
    trust: int
    chemistry: int
    stage: str
    mood: str


class ChatResponse(BaseModel):
    message_id: uuid.UUID
    reply: str
    emotion: str
    intent: str
    relationship: RelationshipPublic
    stage_changed: bool = False
