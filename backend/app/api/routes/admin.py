from fastapi import APIRouter

from app.api.deps import CurrentAdmin, SessionDep
from app.game.analytics import chapter_dropoff, choice_stats, cost_summary, node_dropoff, overview_stats
from app.schemas.admin import ChapterDropOff, ChoiceStat, CostSummary, NodeDropOff, OverviewStats

router = APIRouter(prefix="/api/admin/analytics", tags=["admin"])


@router.get("/overview", response_model=OverviewStats)
def get_overview(current_admin: CurrentAdmin, session: SessionDep) -> OverviewStats:
    return overview_stats(session)


@router.get("/chapter-dropoff", response_model=list[ChapterDropOff])
def get_chapter_dropoff(current_admin: CurrentAdmin, session: SessionDep) -> list[ChapterDropOff]:
    return chapter_dropoff(session)


@router.get("/node-dropoff", response_model=list[NodeDropOff])
def get_node_dropoff(current_admin: CurrentAdmin, session: SessionDep) -> list[NodeDropOff]:
    return node_dropoff(session)


@router.get("/choices", response_model=list[ChoiceStat])
def get_choice_stats(current_admin: CurrentAdmin, session: SessionDep) -> list[ChoiceStat]:
    return choice_stats(session)


@router.get("/cost", response_model=CostSummary)
def get_cost_summary(current_admin: CurrentAdmin, session: SessionDep) -> CostSummary:
    return cost_summary(session)
