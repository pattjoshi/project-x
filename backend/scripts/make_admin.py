"""Grant (or revoke) admin access for a user, for the analytics dashboard.

Run with: python -m scripts.make_admin someone@example.com
          python -m scripts.make_admin someone@example.com --revoke
"""

import sys

from sqlmodel import Session, select

from app.core.database import engine
from app.models.user import User


def set_admin(email: str, is_admin: bool = True) -> None:
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if user is None:
            raise SystemExit(f"No user with email {email!r}.")
        user.is_admin = is_admin
        session.add(user)
        session.commit()
        print(f"{email} is_admin={is_admin}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        raise SystemExit("Usage: python -m scripts.make_admin <email> [--revoke]")
    set_admin(args[0], is_admin="--revoke" not in args)
