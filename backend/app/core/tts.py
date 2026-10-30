from app.core.config import get_settings
from app.core.moderation import get_openai_client


def synthesize_speech(text: str) -> bytes:
    settings = get_settings()
    response = get_openai_client().audio.speech.create(
        model=settings.openai_tts_model,
        voice=settings.openai_tts_voice,
        input=text,
        response_format="mp3",
    )
    return response.read()
