from crewai import Agent, Crew, Process, Task

from core.config import get_settings

SAFETY_NOTE = (
    "Keep it warm and PG-13 - no explicit content, and don't claim the user and "
    "character are in a real-life relationship; this is in-app flavor text."
)


def build_compatibility_report_crew(
    character_name: str,
    personality_prompt: str,
    stage: str,
    affection: int,
    trust: int,
    chemistry: int,
    memory_summary: str,
) -> Crew:
    model = get_settings().openai_chat_model

    writer = Agent(
        role="Relationship Report Writer",
        goal=f"Write a short, warm weekly note from {character_name}'s point of view.",
        backstory=f"{personality_prompt} You're reflecting privately on how things "
        "have been going with someone you've been talking to.",
        llm=model,
    )
    reviewer = Agent(
        role="Safety Reviewer",
        goal="Ensure the note stays appropriate and in-app.",
        backstory="A careful editor who enforces the app's content guidelines.",
        llm=model,
    )

    write_task = Task(
        description=(
            f"Write a 3-5 sentence weekly 'compatibility report' in {character_name}'s "
            f"voice, reflecting on this relationship: stage={stage}, "
            f"affection={affection}, trust={trust}, chemistry={chemistry}. "
            f"What you remember about them: {memory_summary or '(not much yet)'}. "
            f"{SAFETY_NOTE}"
        ),
        expected_output="A short first-person note, no headers or labels.",
        agent=writer,
    )
    review_task = Task(
        description=f"Review the note for tone and safety. {SAFETY_NOTE} "
        "Return the final approved note text only.",
        expected_output="The final note text.",
        agent=reviewer,
        context=[write_task],
    )

    return Crew(agents=[writer, reviewer], tasks=[write_task, review_task], process=Process.sequential)


def generate_compatibility_report(
    character_name: str,
    personality_prompt: str,
    stage: str,
    affection: int,
    trust: int,
    chemistry: int,
    memory_summary: str,
) -> str:
    crew = build_compatibility_report_crew(
        character_name, personality_prompt, stage, affection, trust, chemistry, memory_summary
    )
    result = crew.kickoff()
    return str(result)
