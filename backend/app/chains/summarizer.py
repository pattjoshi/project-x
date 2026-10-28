from langchain_core.prompts import ChatPromptTemplate

from app.core.llm import get_chat_model

SUMMARY_PROMPT = """You maintain a running memory summary of a relationship between a
user and a character, for the character to recall later. Update the summary
below with the new exchange. Keep it under 200 words, written as plain facts
and context (not a transcript).

Existing summary:
{existing_summary}

New exchange:
User: {user_message}
Character: {assistant_reply}

Updated summary:"""


def update_summary(existing_summary: str, user_message: str, assistant_reply: str) -> str:
    prompt = ChatPromptTemplate.from_messages([("human", SUMMARY_PROMPT)])
    chain = prompt | get_chat_model()
    result = chain.invoke(
        {
            "existing_summary": existing_summary or "(none yet)",
            "user_message": user_message,
            "assistant_reply": assistant_reply,
        }
    )
    return str(result.content).strip()
