import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, SessionDep
from app.game.relationships import get_or_create_relationship
from app.models.character import Character
from app.schemas.chat import RelationshipPublic

router = APIRouter(prefix="/api/relationships", tags=["relationships"])


@router.get("/{character_id}", response_model=RelationshipPublic)
def get_relationship(
    character_id: uuid.UUID, current_user: CurrentUser, session: SessionDep
) -> RelationshipPublic:
    if session.get(Character, character_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found.")

    relationship = get_or_create_relationship(session, current_user.id, character_id)
    return RelationshipPublic.model_validate(relationship)
