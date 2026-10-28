"""Seed one published chapter per character for local development.

Run with: python -m scripts.seed_chapters (after scripts.seed_characters)
"""

from sqlmodel import Session, select

from app.core.database import engine
from app.models.chapter import Chapter
from app.models.character import Character

CHAPTERS_BY_CHARACTER_NAME = {
    "Ananya Sharma": ("Monsoon Walk", "ananya/chapter_1.json"),
    "Zara Khan": ("Poetry Night", "zara/chapter_1.json"),
    "Alina Volkova": ("The Empty Studio", "alina/chapter_1.json"),
}


def seed() -> None:
    with Session(engine) as session:
        for character_name, (title, script_ref) in CHAPTERS_BY_CHARACTER_NAME.items():
            character = session.exec(
                select(Character).where(Character.name == character_name)
            ).first()
            if character is None:
                print(f"skipping '{title}': character '{character_name}' not seeded yet")
                continue

            existing = session.exec(
                select(Chapter).where(
                    Chapter.character_id == character.id, Chapter.title == title
                )
            ).first()
            if existing is None:
                session.add(
                    Chapter(
                        character_id=character.id,
                        title=title,
                        unlock_stage="friend",
                        script_ref=script_ref,
                        status="published",
                    )
                )
        session.commit()


if __name__ == "__main__":
    seed()
