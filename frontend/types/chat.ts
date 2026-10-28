export interface RelationshipPublic {
  affection: number;
  trust: number;
  chemistry: number;
  stage: string;
  mood: string;
}

export interface ChatResponse {
  message_id: string;
  reply: string;
  emotion: string;
  intent: string;
  relationship: RelationshipPublic;
  stage_changed: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  emotion?: string;
}
