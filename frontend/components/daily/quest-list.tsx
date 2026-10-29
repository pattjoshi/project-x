import { CheckCircle2, Circle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Quest } from "@/types/daily";

export function QuestList({ quests }: { quests: Quest[] }) {
  return (
    <div className="flex flex-col gap-3">
      {quests.map((quest) => {
        const percent = Math.min(100, (quest.progress / quest.target) * 100);
        return (
          <Card key={quest.id} className="py-4">
            <CardContent className="flex items-center gap-3">
              {quest.completed ? (
                <CheckCircle2 className="size-5 shrink-0 text-primary" />
              ) : (
                <Circle className="size-5 shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{quest.title}</p>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  {quest.progress}/{quest.target} — {quest.reward}
                </p>
                <div className="h-1.5 w-full rounded-full bg-secondary">
                  <div
                    className="gradient-romantic h-1.5 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
