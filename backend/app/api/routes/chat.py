import uuid

from fastapi import APIRouter, HTTPException, Response, status

from app.api.deps import CurrentUser, SessionDep
from app.core.tts import synthesize_speech
from app.game.daily import record_progress
from app.game.relationships import get_or_create_relationship
from app.graphs.chat_graph import get_chat_graph
from app.models.character import Character
from app.models.message import Message
from app.schemas.chat import ChatRequest, ChatResponse, RelationshipPublic

router = APIRouter(prefix="/api/chat", tags=["chat"])


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

    result = get_chat_graph().invoke(
        {
            "session": session,
            "user_id": current_user.id,
            "character_id": character_id,
            "character": character,
            "relationship": relationship,
            "user_message": payload.message,
        }
    )

    session.add(relationship)
    assistant_message = Message(
        user_id=current_user.id,
        character_id=character_id,
        role="assistant",
        content=result["reply"],
        emotion=result["emotion"],
        prompt_tokens=result.get("prompt_tokens"),
        completion_tokens=result.get("completion_tokens"),
    )
    session.add(assistant_message)
    session.commit()
    session.refresh(assistant_message)
    session.refresh(relationship)

    stage_changed = result.get("stage_before") is not None and result["stage_before"] != relationship.stage

    record_progress(session, current_user, "chat_messages")
    if stage_changed:
        record_progress(session, current_user, "level_up")

    return ChatResponse(
        message_id=assistant_message.id,
        reply=result["reply"],
        emotion=result["emotion"],
        intent=result["intent"],
        relationship=RelationshipPublic.model_validate(relationship),
        stage_changed=stage_changed,
    )


@router.get("/{character_id}/messages/{message_id}/speech")
def message_speech(
    character_id: uuid.UUID, message_id: uuid.UUID, current_user: CurrentUser, session: SessionDep
) -> Response:
    message = session.get(Message, message_id)
    if (
        message is None
        or message.character_id != character_id
        or message.user_id != current_user.id
        or message.role != "assistant"
    ):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found.")

    audio = synthesize_speech(message.content)
    return Response(content=audio, media_type="audio/mpeg")
