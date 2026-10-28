from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.api.deps import SessionDep
from app.models.character import Character
from app.schemas.character import CharacterPublic

router = APIRouter(prefix="/api/characters", tags=["characters"])


@router.get("", response_model=list[CharacterPublic])
def list_characters(session: SessionDep) -> list[Character]:
    return list(session.exec(select(Character)).all())


@router.get("/{character_id}", response_model=CharacterPublic)
def get_character(character_id: str, session: SessionDep) -> Character:
    character = session.get(Character, character_id)
    if character is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found.")
    return character
