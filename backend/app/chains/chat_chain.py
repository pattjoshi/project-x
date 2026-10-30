from typing import Literal

from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from app.core.llm import get_chat_model
from app.models.character import Character
from app.models.relationship import Relationship

Emotion = Literal["happy", "flirty", "neutral", "sad", "surprised", "annoyed"]
Intent = Literal[
    "friendly",
    "supportive",
    "flirty",
    "deep_share",
    "neutral",
    "awkward",
    "rude_or_hostile",
    "boundary_push",
]


class ChatReply(BaseModel):
    reply: str = Field(description="The character's in-character reply to the user.")
    emotion: Emotion = Field(description="The character's emotional reaction.")
    intent: Intent = Field(
        description="The social intent behind the user's message, used to update "
        "relationship scores. Use 'boundary_push' when the user pushes for "
        "explicit sexual content."
    )


SYSTEM_TEMPLATE = """{personality_prompt}

Backstory: {lore}

You are chatting with someone you are a "{stage}" with. Your current mood is
{mood}. Stay in character. Keep replies short (1-3 sentences), conversational,
and never break character to mention being an AI.

What you remember about this person:
{memory_context}"""


class ChatReplyWithUsage(BaseModel):
    reply: ChatReply
    prompt_tokens: int | None
    completion_tokens: int | None


def generate_reply(
    character: Character,
    relationship: Relationship,
    message: str,
    memory_context: str = "(nothing yet)",
) -> ChatReplyWithUsage:
    prompt = ChatPromptTemplate.from_messages(
        [("system", SYSTEM_TEMPLATE), ("human", "{message}")]
    )
    chain = prompt | get_chat_model().with_structured_output(ChatReply, include_raw=True)

    outcome = chain.invoke(
        {
            "personality_prompt": character.personality_prompt,
            "lore": character.lore,
            "stage": relationship.stage,
            "mood": relationship.mood,
            "memory_context": memory_context,
            "message": message,
        }
    )
    parsed = outcome["parsed"]
    assert isinstance(parsed, ChatReply)

    usage = getattr(outcome["raw"], "usage_metadata", None)
    return ChatReplyWithUsage(
        reply=parsed,
        prompt_tokens=usage["input_tokens"] if usage else None,
        completion_tokens=usage["output_tokens"] if usage else None,
    )
