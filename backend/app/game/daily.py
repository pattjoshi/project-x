from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from sqlmodel import Session, select

from app.models.quest import Quest
from app.models.user import User
from app.models.user_quest import UserQuest


def today_for_user(user: User) -> date:
    try:
        tz = ZoneInfo(user.timezone)
    except ZoneInfoNotFoundError:
        tz = ZoneInfo("UTC")
    return datetime.now(tz).date()


def ensure_daily_state(session: Session, user: User) -> list[UserQuest]:
    """Lazily rolls the login streak forward and creates today's quest rows,
    the first time the user is seen today - no cron needed."""
    today = today_for_user(user)

    if user.last_active_date != today:
        if user.last_active_date == today - timedelta(days=1):
            user.current_streak += 1
        else:
            user.current_streak = 1
        user.longest_streak = max(user.longest_streak, user.current_streak)
        user.last_active_date = today
        session.add(user)
        session.commit()

    quests = session.exec(select(Quest)).all()
    user_quests = []
    for quest in quests:
        user_quest = session.get(UserQuest, (user.id, quest.id, today))
        if user_quest is None:
            user_quest = UserQuest(user_id=user.id, quest_id=quest.id, quest_date=today)
            session.add(user_quest)
            session.commit()
            session.refresh(user_quest)
        user_quests.append(user_quest)

    return user_quests


def record_progress(session: Session, user: User, quest_type: str, amount: int = 1) -> None:
    today = today_for_user(user)
    quest = session.exec(select(Quest).where(Quest.type == quest_type)).first()
    if quest is None:
        return

    user_quest = session.get(UserQuest, (user.id, quest.id, today))
    if user_quest is None:
        user_quest = UserQuest(user_id=user.id, quest_id=quest.id, quest_date=today)

    if user_quest.completed:
        return

    user_quest.progress = min(user_quest.progress + amount, quest.target)
    user_quest.completed = user_quest.progress >= quest.target
    session.add(user_quest)
    session.commit()
