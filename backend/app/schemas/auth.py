import uuid

from pydantic import BaseModel, ConfigDict, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str
    timezone: str = "UTC"
    age_confirmed: bool


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    display_name: str
    age_verified: bool
    is_admin: bool


class AuthResponse(BaseModel):
    user: UserPublic
    access_token: str
