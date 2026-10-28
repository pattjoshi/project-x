from fastapi import APIRouter
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.game.daily import ensure_daily_state
from app.models.quest import Quest
from app.schemas.daily import DailyStateResponse, QuestPublic, StreakPublic

router = APIRouter(prefix="/api/daily", tags=["daily"])


@router.get("", response_model=DailyStateResponse)
def get_daily_state(current_user: CurrentUser, session: SessionDep) -> DailyStateResponse:
    user_quests = ensure_daily_state(session, current_user)
    quests_by_id = {q.id: q for q in session.exec(select(Quest)).all()}

    quests = [
        QuestPublic(
            id=uq.quest_id,
            title=quests_by_id[uq.quest_id].title,
            type=quests_by_id[uq.quest_id].type,
            target=quests_by_id[uq.quest_id].target,
            progress=uq.progress,
            completed=uq.completed,
            reward=quests_by_id[uq.quest_id].reward,
        )
        for uq in user_quests
    ]

    return DailyStateResponse(
        streak=StreakPublic(current=current_user.current_streak, longest=current_user.longest_streak),
        quests=quests,
    )
