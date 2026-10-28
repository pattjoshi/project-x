import uuid

from sqlmodel import Session, select

from app.core.embeddings import embed_text
from app.models.memory import Memory

TOP_K = 5


def retrieve_memories(
    session: Session, user_id: uuid.UUID, character_id: uuid.UUID, query_text: str
) -> list[str]:
    query_embedding = embed_text(query_text)
    statement = (
        select(Memory)
        .where(Memory.user_id == user_id, Memory.character_id == character_id)
        .order_by(Memory.embedding.cosine_distance(query_embedding))
        .limit(TOP_K)
    )
    return [memory.text for memory in session.exec(statement).all()]


def store_memory(
    session: Session, user_id: uuid.UUID, character_id: uuid.UUID, text: str
) -> None:
    session.add(
        Memory(
            user_id=user_id,
            character_id=character_id,
            text=text,
            embedding=embed_text(text),
        )
    )
    session.commit()
