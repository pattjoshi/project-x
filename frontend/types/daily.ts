export interface Streak {
  current: number;
  longest: number;
}

export interface Quest {
  id: string;
  title: string;
  type: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: string;
}

export interface DailyState {
  streak: Streak;
  quests: Quest[];
}
