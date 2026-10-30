import type { RelationshipPublic } from "@/types/chat";

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface SendGiftResponse {
  affinity: "loved" | "liked" | "disliked";
  relationship: RelationshipPublic;
}
