"""gifts, gift_log tables

Revision ID: 0007
Revises: 0006
Create Date: 2026-10-30

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0007"
down_revision: Union[str, None] = "0006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "gifts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("emoji", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False, server_default=""),
    )

    op.create_table(
        "gift_log",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column(
            "character_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("characters.id"), nullable=False
        ),
        sa.Column("gift_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("gifts.id"), nullable=False),
        sa.Column("affinity", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("gift_log")
    op.drop_table("gifts")
