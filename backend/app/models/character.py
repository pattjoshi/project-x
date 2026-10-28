import uuid

from sqlmodel import Field, SQLModel


class Character(SQLModel, table=True):
    """All characters are adults; `age` must be >= 18 (enforced at the API layer)."""

    __tablename__ = "characters"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    age: int = Field(ge=18)
    bio: str = Field(default="")
    personality_prompt: str = Field(default="")
    lore: str = Field(default="")
    vrm_model_url: str | None = Field(default=None)
    likes: str = Field(default="")
    dislikes: str = Field(default="")
    voice: str | None = Field(default=None)
