"""initial schema: pgvector extension, users, characters, relationships

Revision ID: 0001
Revises:
Create Date: 2026-10-28

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("display_name", sa.String(), nullable=False),
        sa.Column("timezone", sa.String(), nullable=False, server_default="UTC"),
        sa.Column("age_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "characters",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("age", sa.Integer(), nullable=False),
        sa.Column("bio", sa.String(), nullable=False, server_default=""),
        sa.Column("personality_prompt", sa.String(), nullable=False, server_default=""),
        sa.Column("lore", sa.String(), nullable=False, server_default=""),
        sa.Column("vrm_model_url", sa.String(), nullable=True),
        sa.Column("likes", sa.String(), nullable=False, server_default=""),
        sa.Column("dislikes", sa.String(), nullable=False, server_default=""),
        sa.Column("voice", sa.String(), nullable=True),
        sa.CheckConstraint("age >= 18", name="ck_characters_age_adult"),
    )

    op.create_table(
        "relationships",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column(
            "character_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("characters.id"),
            primary_key=True,
        ),
        sa.Column("affection", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("trust", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("chemistry", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("stage", sa.String(), nullable=False, server_default="stranger"),
        sa.Column("mood", sa.String(), nullable=False, server_default="neutral"),
        sa.Column("memory_summary", sa.String(), nullable=False, server_default=""),
    )


def downgrade() -> None:
    op.drop_table("relationships")
    op.drop_table("characters")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
