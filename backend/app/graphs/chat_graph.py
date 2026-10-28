import uuid
from typing import TypedDict

from langgraph.graph import END, START, StateGraph
from sqlmodel import Session

from app.chains.chat_chain import generate_reply
from app.chains.summarizer import update_summary
from app.core.moderation import is_flagged
from app.game.memory import retrieve_memories, store_memory
from app.game.score_rules import apply_score_rules
from app.models.character import Character
from app.models.relationship import Relationship

SAFE_REFUSAL_REPLY = "Let's talk about something else."


class ChatState(TypedDict):
    session: Session
    user_id: uuid.UUID
    character_id: uuid.UUID
    character: Character
    relationship: Relationship
    user_message: str
    flagged_input: bool
    flagged_output: bool
    memory_context: str
    reply: str
    emotion: str
    intent: str
    stage_before: str


def _moderate_input(state: ChatState) -> dict:
    return {"flagged_input": is_flagged(state["user_message"])}


def _route_after_input_moderation(state: ChatState) -> str:
    return "refuse" if state["flagged_input"] else "load_memory"


def _refuse(state: ChatState) -> dict:
    return {"reply": SAFE_REFUSAL_REPLY, "emotion": "neutral", "intent": "neutral"}


def _load_memory(state: ChatState) -> dict:
    relationship = state["relationship"]
    memories = retrieve_memories(
        state["session"], state["user_id"], state["character_id"], state["user_message"]
    )
    parts = []
    if relationship.memory_summary:
        parts.append(f"Summary: {relationship.memory_summary}")
    if memories:
        parts.append("Specific memories: " + "; ".join(memories))
    return {"memory_context": "\n".join(parts) if parts else "(nothing yet)"}


def _generate(state: ChatState) -> dict:
    result = generate_reply(
        state["character"], state["relationship"], state["user_message"], state["memory_context"]
    )
    return {"reply": result.reply, "emotion": result.emotion, "intent": result.intent}


def _moderate_output(state: ChatState) -> dict:
    if is_flagged(state["reply"]):
        return {
            "reply": SAFE_REFUSAL_REPLY,
            "emotion": "neutral",
            "intent": "neutral",
            "flagged_output": True,
        }
    return {"flagged_output": False}


def _apply_scores(state: ChatState) -> dict:
    stage_before = state["relationship"].stage
    apply_score_rules(state["relationship"], state["intent"])
    return {"stage_before": stage_before}


def _route_after_scores(state: ChatState) -> str:
    return "end" if state["flagged_output"] else "store_memory"


def _store_memory(state: ChatState) -> dict:
    relationship = state["relationship"]
    character = state["character"]
    exchange = f"User: {state['user_message']}\n{character.name}: {state['reply']}"
    store_memory(state["session"], state["user_id"], state["character_id"], exchange)
    relationship.memory_summary = update_summary(
        relationship.memory_summary, state["user_message"], state["reply"]
    )
    return {}


def build_chat_graph():
    graph = StateGraph(ChatState)
    graph.add_node("moderate_input", _moderate_input)
    graph.add_node("refuse", _refuse)
    graph.add_node("load_memory", _load_memory)
    graph.add_node("generate", _generate)
    graph.add_node("moderate_output", _moderate_output)
    graph.add_node("apply_scores", _apply_scores)
    graph.add_node("store_memory", _store_memory)

    graph.add_edge(START, "moderate_input")
    graph.add_conditional_edges(
        "moderate_input",
        _route_after_input_moderation,
        {"refuse": "refuse", "load_memory": "load_memory"},
    )
    graph.add_edge("refuse", END)
    graph.add_edge("load_memory", "generate")
    graph.add_edge("generate", "moderate_output")
    graph.add_edge("moderate_output", "apply_scores")
    graph.add_conditional_edges(
        "apply_scores",
        _route_after_scores,
        {"end": END, "store_memory": "store_memory"},
    )
    graph.add_edge("store_memory", END)

    return graph.compile()


_chat_graph = None


def get_chat_graph():
    global _chat_graph
    if _chat_graph is None:
        _chat_graph = build_chat_graph()
    return _chat_graph
