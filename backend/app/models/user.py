import uuid
from datetime import date, datetime, timezone

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    display_name: str
    timezone: str = Field(default="UTC")
    age_verified: bool = Field(default=False)
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    last_active_date: date | None = Field(default=None)
    current_streak: int = Field(default=0)
    longest_streak: int = Field(default=0)
