from sqlmodel import Session, func, select

from app.models.chapter import Chapter
from app.models.chapter_progress import ChapterProgress
from app.models.choice_log import ChoiceLog
from app.models.gift_log import GiftLog
from app.models.message import Message
from app.models.relationship import Relationship
from app.models.user import User
from app.schemas.admin import (
    ChapterDropOff,
    ChoiceStat,
    CostSummary,
    NodeDropOff,
    OverviewStats,
    UserCost,
)

# gpt-4o-mini pricing as of this project's writing (USD per 1M tokens).
# Only chat-completion tokens are tracked (see Message.prompt_tokens /
# completion_tokens); moderation calls are free and TTS/embeddings aren't
# metered here - this is an estimate, not a metered bill.
PROMPT_COST_PER_MILLION = 0.15
COMPLETION_COST_PER_MILLION = 0.60


def overview_stats(session: Session) -> OverviewStats:
    total_users = session.exec(select(func.count()).select_from(User)).one()
    total_messages = session.exec(select(func.count()).select_from(Message)).one()
    total_gifts_sent = session.exec(select(func.count()).select_from(GiftLog)).one()

    stage_rows = session.exec(
        select(Relationship.stage, func.count()).group_by(Relationship.stage)
    ).all()

    return OverviewStats(
        total_users=total_users,
        total_messages=total_messages,
        total_gifts_sent=total_gifts_sent,
        stage_counts={stage: count for stage, count in stage_rows},
    )


def chapter_dropoff(session: Session) -> list[ChapterDropOff]:
    chapters = session.exec(select(Chapter)).all()
    results = []
    for chapter in chapters:
        started = session.exec(
            select(func.count())
            .select_from(ChapterProgress)
            .where(ChapterProgress.chapter_id == chapter.id)
        ).one()
        completed = session.exec(
            select(func.count())
            .select_from(ChapterProgress)
            .where(ChapterProgress.chapter_id == chapter.id, ChapterProgress.completed.is_(True))
        ).one()
        if started > 0:
            results.append(
                ChapterDropOff(
                    chapter_id=chapter.id, chapter_title=chapter.title, started=started, completed=completed
                )
            )
    return results


def node_dropoff(session: Session, limit: int = 10) -> list[NodeDropOff]:
    rows = session.exec(
        select(ChapterProgress.chapter_id, ChapterProgress.current_node, func.count())
        .where(ChapterProgress.completed.is_(False))
        .group_by(ChapterProgress.chapter_id, ChapterProgress.current_node)
        .order_by(func.count().desc())
        .limit(limit)
    ).all()

    chapters = {c.id: c.title for c in session.exec(select(Chapter)).all()}
    return [
        NodeDropOff(
            chapter_id=chapter_id,
            chapter_title=chapters.get(chapter_id, "(unknown chapter)"),
            node_id=node_id,
            stuck_count=count,
        )
        for chapter_id, node_id, count in rows
    ]


def choice_stats(session: Session, limit: int = 20) -> list[ChoiceStat]:
    rows = session.exec(
        select(ChoiceLog.chapter_id, ChoiceLog.node_id, ChoiceLog.choice, func.count())
        .group_by(ChoiceLog.chapter_id, ChoiceLog.node_id, ChoiceLog.choice)
        .order_by(func.count().desc())
        .limit(limit)
    ).all()

    chapters = {c.id: c.title for c in session.exec(select(Chapter)).all()}
    return [
        ChoiceStat(
            chapter_id=chapter_id,
            chapter_title=chapters.get(chapter_id, "(unknown chapter)"),
            node_id=node_id,
            choice=choice,
            count=count,
        )
        for chapter_id, node_id, choice, count in rows
    ]


def cost_summary(session: Session, top_n: int = 10) -> CostSummary:
    rows = session.exec(
        select(
            Message.user_id,
            func.count(),
            func.coalesce(func.sum(Message.prompt_tokens), 0),
            func.coalesce(func.sum(Message.completion_tokens), 0),
        )
        .where(Message.role == "assistant", Message.prompt_tokens.is_not(None))
        .group_by(Message.user_id)
    ).all()

    users = {u.id: u.display_name for u in session.exec(select(User)).all()}

    costed = []
    total_cost = 0.0
    for user_id, message_count, prompt_tokens, completion_tokens in rows:
        cost = (
            prompt_tokens / 1_000_000 * PROMPT_COST_PER_MILLION
            + completion_tokens / 1_000_000 * COMPLETION_COST_PER_MILLION
        )
        total_cost += cost
        costed.append(
            UserCost(
                user_id=user_id,
                display_name=users.get(user_id, "(unknown user)"),
                message_count=message_count,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                estimated_cost_usd=round(cost, 4),
            )
        )

    costed.sort(key=lambda u: u.estimated_cost_usd, reverse=True)
    return CostSummary(total_estimated_cost_usd=round(total_cost, 4), top_users=costed[:top_n])
