import { CheckCircle2, Circle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Quest } from "@/types/daily";

export function QuestList({ quests }: { quests: Quest[] }) {
  return (
    <div className="flex flex-col gap-3">
      {quests.map((quest) => (
        <Card key={quest.id}>
          <CardContent className="flex items-center gap-3 pt-2">
            {quest.completed ? (
              <CheckCircle2 className="size-5 shrink-0 text-primary" />
            ) : (
              <Circle className="size-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{quest.title}</p>
              <p className="text-xs text-muted-foreground">
                {quest.progress}/{quest.target} — {quest.reward}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
