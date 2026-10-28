from functools import lru_cache

from openai import OpenAI

from app.core.config import get_settings


@lru_cache
def get_openai_client() -> OpenAI:
    return OpenAI(api_key=get_settings().openai_api_key)


def is_flagged(text: str) -> bool:
    result = get_openai_client().moderations.create(
        model="omni-moderation-latest", input=text
    )
    return result.results[0].flagged
