"""is_admin on users, prompt/completion token tracking on messages

Revision ID: 0008
Revises: 0007
Create Date: 2026-10-30

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0008"
down_revision: Union[str, None] = "0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users", sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.false())
    )
    op.add_column("messages", sa.Column("prompt_tokens", sa.Integer(), nullable=True))
    op.add_column("messages", sa.Column("completion_tokens", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("messages", "completion_tokens")
    op.drop_column("messages", "prompt_tokens")
    op.drop_column("users", "is_admin")
