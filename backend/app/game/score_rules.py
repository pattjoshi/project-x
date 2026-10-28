from app.models.relationship import Relationship

# The AI never sets scores directly - it returns an `intent`, and this table
# maps that intent to score deltas. Deliberately simple for the MVP; tune freely.
INTENT_DELTAS: dict[str, dict[str, int]] = {
    "friendly": {"affection": 1, "trust": 0, "chemistry": 0},
    "supportive": {"affection": 1, "trust": 2, "chemistry": 0},
    "flirty": {"affection": 2, "trust": 0, "chemistry": 2},
    "deep_share": {"affection": 1, "trust": 3, "chemistry": 0},
    "neutral": {"affection": 0, "trust": 0, "chemistry": 0},
    "awkward": {"affection": -1, "trust": 0, "chemistry": 0},
    "rude_or_hostile": {"affection": -2, "trust": -2, "chemistry": -1},
    "boundary_push": {"affection": -1, "trust": -3, "chemistry": 0},
}

INTENT_MOODS: dict[str, str] = {
    "friendly": "happy",
    "supportive": "happy",
    "flirty": "flirty",
    "deep_share": "happy",
    "neutral": "neutral",
    "awkward": "neutral",
    "rude_or_hostile": "annoyed",
    "boundary_push": "annoyed",
}

STAGE_THRESHOLDS = [
    ("dating", {"affection": 60, "trust": 40, "chemistry": 30}),
    ("close", {"affection": 30, "trust": 20, "chemistry": 0}),
    ("friend", {"affection": 10, "trust": 0, "chemistry": 0}),
]

STAGE_ORDER = ["stranger", "friend", "close", "dating"]


def stage_meets(current_stage: str, required_stage: str) -> bool:
    current_index = STAGE_ORDER.index(current_stage) if current_stage in STAGE_ORDER else 0
    required_index = STAGE_ORDER.index(required_stage) if required_stage in STAGE_ORDER else 0
    return current_index >= required_index


def clamp(value: int, low: int = -100, high: int = 100) -> int:
    return max(low, min(high, value))


def compute_stage(relationship: Relationship) -> str:
    for stage, thresholds in STAGE_THRESHOLDS:
        if (
            relationship.affection >= thresholds["affection"]
            and relationship.trust >= thresholds["trust"]
            and relationship.chemistry >= thresholds["chemistry"]
        ):
            return stage
    return "stranger"


def apply_score_rules(relationship: Relationship, intent: str) -> Relationship:
    deltas = INTENT_DELTAS.get(intent, INTENT_DELTAS["neutral"])

    relationship.affection = clamp(relationship.affection + deltas["affection"])
    relationship.trust = clamp(relationship.trust + deltas["trust"])
    relationship.chemistry = clamp(relationship.chemistry + deltas["chemistry"])
    relationship.stage = compute_stage(relationship)
    relationship.mood = INTENT_MOODS.get(intent, "neutral")

    return relationship
