import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, SessionDep
from app.chains.chat_chain import generate_reply
from app.core.moderation import is_flagged
from app.game.relationships import get_or_create_relationship
from app.game.score_rules import apply_score_rules
from app.models.character import Character
from app.models.message import Message
from app.schemas.chat import ChatRequest, ChatResponse, RelationshipPublic

router = APIRouter(prefix="/api/chat", tags=["chat"])

SAFE_REFUSAL_REPLY = "Let's talk about something else."


@router.post("/{character_id}", response_model=ChatResponse)
def chat(
    character_id: uuid.UUID,
    payload: ChatRequest,
    current_user: CurrentUser,
    session: SessionDep,
) -> ChatResponse:
    character = session.get(Character, character_id)
    if character is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found.")

    relationship = get_or_create_relationship(session, current_user.id, character_id)

    session.add(
        Message(
            user_id=current_user.id,
            character_id=character_id,
            role="user",
            content=payload.message,
        )
    )

    if is_flagged(payload.message):
        reply, emotion, intent = SAFE_REFUSAL_REPLY, "neutral", "neutral"
    else:
        result = generate_reply(character, relationship, payload.message)
        if is_flagged(result.reply):
            reply, emotion, intent = SAFE_REFUSAL_REPLY, "neutral", "neutral"
        else:
            reply, emotion, intent = result.reply, result.emotion, result.intent
            apply_score_rules(relationship, intent)

    session.add(relationship)
    assistant_message = Message(
        user_id=current_user.id,
        character_id=character_id,
        role="assistant",
        content=reply,
        emotion=emotion,
    )
    session.add(assistant_message)
    session.commit()
    session.refresh(assistant_message)
    session.refresh(relationship)

    return ChatResponse(
        message_id=assistant_message.id,
        reply=reply,
        emotion=emotion,
        intent=intent,
        relationship=RelationshipPublic.model_validate(relationship),
    )
