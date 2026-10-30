"""Point a character at a real VRM model instead of the procedural placeholder.

Run with: python -m scripts.set_character_vrm "Ananya Sharma" /models/ananya.vrm
          python -m scripts.set_character_vrm "Ananya Sharma" --clear
"""

import sys

from sqlmodel import Session, select

from app.core.database import engine
from app.models.character import Character


def set_vrm(name: str, vrm_model_url: str | None) -> None:
    with Session(engine) as session:
        character = session.exec(select(Character).where(Character.name == name)).first()
        if character is None:
            raise SystemExit(f"No character named {name!r}.")
        character.vrm_model_url = vrm_model_url
        session.add(character)
        session.commit()
        print(f"{name}.vrm_model_url = {vrm_model_url!r}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) < 2:
        raise SystemExit(
            'Usage: python -m scripts.set_character_vrm "<name>" <url-or-path>\n'
            '   or: python -m scripts.set_character_vrm "<name>" --clear'
        )
    name, value = args[0], args[1]
    set_vrm(name, None if value == "--clear" else value)
