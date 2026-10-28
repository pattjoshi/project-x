"""chapters, chapter_progress, choices_log tables

Revision ID: 0004
Revises: 0003
Create Date: 2026-10-28

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "chapters",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "character_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("characters.id"), nullable=False
        ),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("unlock_stage", sa.String(), nullable=False, server_default="stranger"),
        sa.Column("script_ref", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="draft"),
    )

    op.create_table(
        "chapter_progress",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column(
            "chapter_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("chapters.id"),
            primary_key=True,
        ),
        sa.Column("current_node", sa.String(), nullable=False),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.false()),
    )

    op.create_table(
        "choices_log",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column(
            "chapter_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("chapters.id"), nullable=False
        ),
        sa.Column("node_id", sa.String(), nullable=False),
        sa.Column("choice", sa.String(), nullable=False),
        sa.Column("score_delta", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("choices_log")
    op.drop_table("chapter_progress")
    op.drop_table("chapters")
