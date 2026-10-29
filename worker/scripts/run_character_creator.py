"""Admin/dev CLI: turn a short idea into a full character profile for review.

No admin UI exists yet, so this just prints the generated profile - a human
reviews it and adds it to backend/scripts/seed_characters.py (or a future
admin tool) if it's good.

Run with: python -m scripts.run_character_creator "a cheerful barista from Pune"
"""

import json
import sys

from crews.character_creator import generate_character_profile


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.run_character_creator \"<idea>\"")
        sys.exit(1)

    idea = sys.argv[1]
    profile = generate_character_profile(idea)
    print(json.dumps(profile.model_dump(), indent=2))


if __name__ == "__main__":
    main()
