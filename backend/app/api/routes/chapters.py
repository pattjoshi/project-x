import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, SessionDep
from app.game.chapters import apply_choice, get_current_node, get_or_start_progress, list_unlocked_chapters
from app.game.daily import record_progress
from app.game.relationships import get_or_create_relationship
from app.models.chapter import Chapter
from app.models.chapter_progress import ChapterProgress
from app.models.character import Character
from app.schemas.chapter import ChapterNodeResponse, ChapterSummary, ChoiceRequest
from app.schemas.chat import RelationshipPublic

router = APIRouter(prefix="/api/chapters", tags=["chapters"])


def _get_chapter_or_404(session: SessionDep, chapter_id: uuid.UUID) -> Chapter:
    chapter = session.get(Chapter, chapter_id)
    if chapter is None or chapter.status != "published":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chapter not found.")
    return chapter


@router.get("/{character_id}", response_model=list[ChapterSummary])
def list_chapters(
    character_id: uuid.UUID, current_user: CurrentUser, session: SessionDep
) -> list[ChapterSummary]:
    if session.get(Character, character_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found.")

    relationship = get_or_create_relationship(session, current_user.id, character_id)
    chapters = list_unlocked_chapters(session, relationship, character_id)

    summaries = []
    for chapter in chapters:
        progress = session.get(ChapterProgress, (current_user.id, chapter.id))
        summaries.append(
            ChapterSummary(id=chapter.id, title=chapter.title, completed=bool(progress and progress.completed))
        )
    return summaries


@router.get("/{character_id}/{chapter_id}", response_model=ChapterNodeResponse)
def get_chapter_node(
    character_id: uuid.UUID, chapter_id: uuid.UUID, current_user: CurrentUser, session: SessionDep
) -> ChapterNodeResponse:
    chapter = _get_chapter_or_404(session, chapter_id)
    relationship = get_or_create_relationship(session, current_user.id, character_id)
    progress = get_or_start_progress(session, current_user.id, chapter)
    node = get_current_node(chapter, progress)

    return ChapterNodeResponse(
        chapter_id=chapter.id,
        node_id=progress.current_node,
        text=node["text"],
        choices=[c["text"] for c in node.get("choices", [])],
        ending=bool(node.get("ending", False)),
        relationship=RelationshipPublic.model_validate(relationship),
    )


@router.post("/{character_id}/{chapter_id}/choose", response_model=ChapterNodeResponse)
def choose(
    character_id: uuid.UUID,
    chapter_id: uuid.UUID,
    payload: ChoiceRequest,
    current_user: CurrentUser,
    session: SessionDep,
) -> ChapterNodeResponse:
    chapter = _get_chapter_or_404(session, chapter_id)
    relationship = get_or_create_relationship(session, current_user.id, character_id)
    progress = get_or_start_progress(session, current_user.id, chapter)

    stage_before = relationship.stage
    try:
        next_node = apply_choice(
            session, current_user.id, chapter, relationship, progress, payload.choice_index
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    stage_changed = stage_before != relationship.stage
    record_progress(session, current_user, "chapter_choice")
    if stage_changed:
        record_progress(session, current_user, "level_up")

    return ChapterNodeResponse(
        chapter_id=chapter.id,
        node_id=progress.current_node,
        text=next_node["text"],
        choices=[c["text"] for c in next_node.get("choices", [])],
        ending=bool(next_node.get("ending", False)),
        relationship=RelationshipPublic.model_validate(relationship),
        stage_changed=stage_changed,
    )
