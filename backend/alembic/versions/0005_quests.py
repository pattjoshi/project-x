"""quests, user_quests tables; streak columns on users

Revision ID: 0005
Revises: 0004
Create Date: 2026-10-28

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("last_active_date", sa.Date(), nullable=True))
    op.add_column(
        "users", sa.Column("current_streak", sa.Integer(), nullable=False, server_default="0")
    )
    op.add_column(
        "users", sa.Column("longest_streak", sa.Integer(), nullable=False, server_default="0")
    )

    op.create_table(
        "quests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("type", sa.String(), nullable=False, unique=True),
        sa.Column("target", sa.Integer(), nullable=False),
        sa.Column("reward", sa.String(), nullable=False),
    )

    op.create_table(
        "user_quests",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column(
            "quest_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("quests.id"), primary_key=True
        ),
        sa.Column("quest_date", sa.Date(), primary_key=True),
        sa.Column("progress", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.false()),
    )


def downgrade() -> None:
    op.drop_table("user_quests")
    op.drop_table("quests")
    op.drop_column("users", "longest_streak")
    op.drop_column("users", "current_streak")
    op.drop_column("users", "last_active_date")
