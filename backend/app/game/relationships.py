import uuid

from sqlmodel import Session

from app.models.relationship import Relationship


def get_or_create_relationship(
    session: Session, user_id: uuid.UUID, character_id: uuid.UUID
) -> Relationship:
    relationship = session.get(Relationship, (user_id, character_id))
    if relationship is None:
        relationship = Relationship(user_id=user_id, character_id=character_id)
        session.add(relationship)
        session.commit()
        session.refresh(relationship)
    return relationship
