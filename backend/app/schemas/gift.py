import uuid

from pydantic import BaseModel

from app.schemas.chat import RelationshipPublic


class GiftPublic(BaseModel):
    id: uuid.UUID
    name: str
    emoji: str
    description: str


class SendGiftResponse(BaseModel):
    affinity: str
    relationship: RelationshipPublic
