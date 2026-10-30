import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class GiftLog(SQLModel, table=True):
    __tablename__ = "gift_log"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    character_id: uuid.UUID = Field(foreign_key="characters.id")
    gift_id: uuid.UUID = Field(foreign_key="gifts.id")
    affinity: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
