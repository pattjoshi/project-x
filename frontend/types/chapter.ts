import type { RelationshipPublic } from "@/types/chat";

export interface ChapterSummary {
  id: string;
  title: string;
  completed: boolean;
}

export interface ChapterNodeResponse {
  chapter_id: string;
  node_id: string;
  text: string;
  choices: string[];
  ending: boolean;
  relationship: RelationshipPublic;
  stage_changed: boolean;
}
