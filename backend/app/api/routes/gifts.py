import uuid

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.game.gifts import apply_gift, compute_affinity
from app.game.relationships import get_or_create_relationship
from app.models.character import Character
from app.models.gift import Gift
from app.models.gift_log import GiftLog
from app.schemas.chat import RelationshipPublic
from app.schemas.gift import GiftPublic, SendGiftResponse

router = APIRouter(prefix="/api/gifts", tags=["gifts"])


@router.get("", response_model=list[GiftPublic])
def list_gifts(session: SessionDep) -> list[Gift]:
    return list(session.exec(select(Gift)).all())


@router.post("/{character_id}/{gift_id}", response_model=SendGiftResponse)
def send_gift(
    character_id: uuid.UUID, gift_id: uuid.UUID, current_user: CurrentUser, session: SessionDep
) -> SendGiftResponse:
    character = session.get(Character, character_id)
    if character is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found.")

    gift = session.get(Gift, gift_id)
    if gift is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gift not found.")

    relationship = get_or_create_relationship(session, current_user.id, character_id)
    affinity = compute_affinity(character, gift)
    apply_gift(relationship, affinity)

    session.add(relationship)
    session.add(
        GiftLog(
            user_id=current_user.id, character_id=character_id, gift_id=gift_id, affinity=affinity
        )
    )
    session.commit()
    session.refresh(relationship)

    return SendGiftResponse(affinity=affinity, relationship=RelationshipPublic.model_validate(relationship))
