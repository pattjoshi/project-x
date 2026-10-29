from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg2://app:app@db:5432/dating_sim"
    redis_url: str = "redis://redis:6379"

    openai_api_key: str = ""
    openai_chat_model: str = "gpt-4o-mini"


@lru_cache
def get_settings() -> Settings:
    return Settings()
