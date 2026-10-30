from app.game.score_rules import clamp, compute_stage
from app.models.character import Character
from app.models.gift import Gift
from app.models.relationship import Relationship

AFFINITY_DELTAS: dict[str, dict[str, int]] = {
    "loved": {"affection": 5, "trust": 0, "chemistry": 2},
    "liked": {"affection": 2, "trust": 0, "chemistry": 0},
    "disliked": {"affection": -3, "trust": -1, "chemistry": 0},
}


def compute_affinity(character: Character, gift: Gift) -> str:
    name = gift.name.lower()
    likes = character.likes.lower()
    dislikes = character.dislikes.lower()

    if any(word in likes for word in name.split()):
        return "loved"
    if any(word in dislikes for word in name.split()):
        return "disliked"
    return "liked"


def apply_gift(relationship: Relationship, affinity: str) -> Relationship:
    delta = AFFINITY_DELTAS.get(affinity, AFFINITY_DELTAS["liked"])
    relationship.affection = clamp(relationship.affection + delta["affection"])
    relationship.trust = clamp(relationship.trust + delta["trust"])
    relationship.chemistry = clamp(relationship.chemistry + delta["chemistry"])
    relationship.stage = compute_stage(relationship)
    return relationship
