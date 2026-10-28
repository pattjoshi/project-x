from app.core.config import get_settings
from app.core.moderation import get_openai_client


def embed_text(text: str) -> list[float]:
    settings = get_settings()
    result = get_openai_client().embeddings.create(
        model=settings.openai_embedding_model, input=text
    )
    return result.data[0].embedding
