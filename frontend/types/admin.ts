export interface OverviewStats {
  total_users: number;
  total_messages: number;
  total_gifts_sent: number;
  stage_counts: Record<string, number>;
}

export interface ChapterDropOff {
  chapter_id: string;
  chapter_title: string;
  started: number;
  completed: number;
}

export interface NodeDropOff {
  chapter_id: string;
  chapter_title: string;
  node_id: string;
  stuck_count: number;
}

export interface ChoiceStat {
  chapter_id: string;
  chapter_title: string;
  node_id: string;
  choice: string;
  count: number;
}

export interface UserCost {
  user_id: string;
  display_name: string;
  message_count: number;
  prompt_tokens: number;
  completion_tokens: number;
  estimated_cost_usd: number;
}

export interface CostSummary {
  total_estimated_cost_usd: number;
  top_users: UserCost[];
}
