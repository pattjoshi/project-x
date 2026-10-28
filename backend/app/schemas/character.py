import uuid

from pydantic import BaseModel


class CharacterPublic(BaseModel):
    id: uuid.UUID
    name: str
    age: int
    bio: str
    likes: str
    dislikes: str
    vrm_model_url: str | None
    voice: str | None
