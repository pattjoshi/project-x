import uuid

from sqlmodel import Session, select

from app.game.score_rules import clamp, compute_stage, stage_meets
from app.game.story_loader import load_chapter_script
from app.models.chapter import Chapter
from app.models.chapter_progress import ChapterProgress
from app.models.choice_log import ChoiceLog
from app.models.relationship import Relationship


def list_unlocked_chapters(
    session: Session, relationship: Relationship, character_id: uuid.UUID
) -> list[Chapter]:
    chapters = session.exec(
        select(Chapter).where(Chapter.character_id == character_id, Chapter.status == "published")
    ).all()
    return [c for c in chapters if stage_meets(relationship.stage, c.unlock_stage)]


def get_or_start_progress(session: Session, user_id: uuid.UUID, chapter: Chapter) -> ChapterProgress:
    progress = session.get(ChapterProgress, (user_id, chapter.id))
    if progress is None:
        script = load_chapter_script(chapter.script_ref)
        progress = ChapterProgress(
            user_id=user_id, chapter_id=chapter.id, current_node=script["start_node"]
        )
        session.add(progress)
        session.commit()
        session.refresh(progress)
    return progress


def get_current_node(chapter: Chapter, progress: ChapterProgress) -> dict:
    script = load_chapter_script(chapter.script_ref)
    return script["nodes"][progress.current_node]


def apply_choice(
    session: Session,
    user_id: uuid.UUID,
    chapter: Chapter,
    relationship: Relationship,
    progress: ChapterProgress,
    choice_index: int,
) -> dict:
    node = get_current_node(chapter, progress)
    choices = node.get("choices", [])
    if choice_index < 0 or choice_index >= len(choices):
        raise ValueError("Invalid choice index.")

    choice = choices[choice_index]
    delta: dict[str, int] = choice.get("score_delta", {})

    relationship.affection = clamp(relationship.affection + delta.get("affection", 0))
    relationship.trust = clamp(relationship.trust + delta.get("trust", 0))
    relationship.chemistry = clamp(relationship.chemistry + delta.get("chemistry", 0))
    relationship.stage = compute_stage(relationship)

    session.add(
        ChoiceLog(
            user_id=user_id,
            chapter_id=chapter.id,
            node_id=progress.current_node,
            choice=choice["text"],
            score_delta=delta,
        )
    )

    progress.current_node = choice["next"]
    next_node = load_chapter_script(chapter.script_ref)["nodes"][progress.current_node]
    progress.completed = bool(next_node.get("ending", False))

    session.add(progress)
    session.add(relationship)
    session.commit()

    return next_node
