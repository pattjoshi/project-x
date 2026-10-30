"""Seed the fixed gift catalog.

Run with: python -m scripts.seed_gifts
"""

from sqlmodel import Session, select

from app.core.database import engine
from app.models.gift import Gift

GIFTS = [
    Gift(name="Coffee", emoji="☕", description="A warm cup of coffee."),
    Gift(name="Flowers", emoji="💐", description="A small bouquet."),
    Gift(name="Book", emoji="📖", description="A paperback novel."),
    Gift(name="Chai", emoji="🍵", description="Freshly brewed chai."),
    Gift(name="Chocolate", emoji="🍫", description="A box of chocolates."),
    Gift(name="Concert Ticket", emoji="🎟️", description="Tickets to a local show."),
]


def seed() -> None:
    with Session(engine) as session:
        for gift in GIFTS:
            existing = session.exec(select(Gift).where(Gift.name == gift.name)).first()
            if existing is None:
                session.add(gift)
        session.commit()


if __name__ == "__main__":
    seed()
