import uuid

from pydantic import BaseModel


class JobPublic(BaseModel):
    id: uuid.UUID
    type: str
    status: str
    output: dict | None
