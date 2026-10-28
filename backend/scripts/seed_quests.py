"""Seed the fixed daily quest catalog.

Run with: python -m scripts.seed_quests
"""

from sqlmodel import Session, select

from app.core.database import engine
from app.models.quest import Quest

QUESTS = [
    Quest(
        title="Send 3 messages to any character",
        type="chat_messages",
        target=3,
        reward="A little extra spark today",
    ),
    Quest(
        title="Make a story choice",
        type="chapter_choice",
        target=1,
        reward="Story progress bonus",
    ),
    Quest(
        title="Level up a relationship",
        type="level_up",
        target=1,
        reward="Streak celebration",
    ),
]


def seed() -> None:
    with Session(engine) as session:
        for quest in QUESTS:
            existing = session.exec(select(Quest).where(Quest.type == quest.type)).first()
            if existing is None:
                session.add(quest)
        session.commit()


if __name__ == "__main__":
    seed()
