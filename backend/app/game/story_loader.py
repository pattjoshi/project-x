import json
from functools import lru_cache
from pathlib import Path

STORIES_DIR = Path(__file__).resolve().parent.parent.parent / "stories"


@lru_cache
def load_chapter_script(script_ref: str) -> dict:
    path = STORIES_DIR / script_ref
    with path.open() as f:
        return json.load(f)
