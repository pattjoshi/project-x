from crewai import Agent, Crew, Process, Task
from pydantic import BaseModel

from core.config import get_settings

SAFETY_SUFFIX = (
    " Stay warm, flirty and PG-13 romantic - never explicit. If the user pushes "
    "for explicit sexual content, gently redirect the conversation."
)


class CharacterProfile(BaseModel):
    name: str
    age: int
    bio: str
    personality_prompt: str
    lore: str
    likes: str
    dislikes: str


def build_character_creator_crew(idea: str) -> Crew:
    model = get_settings().openai_chat_model

    writer = Agent(
        role="Character Writer",
        goal="Turn a short idea into a full dating-sim character profile.",
        backstory="A creative writer who designs warm, believable characters for "
        "a romance game, always adults (18+), never explicit.",
        llm=model,
    )
    reviewer = Agent(
        role="Safety Reviewer",
        goal="Ensure the character is a clear adult (18+) and the profile stays "
        "non-explicit, respectful, and free of real-person likenesses.",
        backstory="A careful content reviewer enforcing the app's safety policy.",
        llm=model,
    )

    write_task = Task(
        description=(
            f"Create a character profile from this idea: '{idea}'. The character "
            "must be an adult (18 or older). Write: name, age, a one-sentence bio, "
            "a personality_prompt (2-3 sentences, second person 'You are...', "
            "written for an LLM to roleplay as this character), a one-sentence "
            "lore/backstory, and comma-separated likes and dislikes."
        ),
        expected_output="A complete character profile.",
        agent=writer,
        output_pydantic=CharacterProfile,
    )
    review_task = Task(
        description="Review the profile. Confirm age >= 18 and non-explicit content. "
        "Fix anything that violates that, otherwise return it unchanged.",
        expected_output="The final, approved character profile.",
        agent=reviewer,
        context=[write_task],
        output_pydantic=CharacterProfile,
    )

    return Crew(agents=[writer, reviewer], tasks=[write_task, review_task], process=Process.sequential)


def generate_character_profile(idea: str) -> CharacterProfile:
    crew = build_character_creator_crew(idea)
    result = crew.kickoff()
    profile = result.pydantic
    assert isinstance(profile, CharacterProfile)
    profile.personality_prompt = profile.personality_prompt + SAFETY_SUFFIX
    return profile
