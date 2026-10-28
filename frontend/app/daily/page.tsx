import { redirect } from "next/navigation";

import { QuestList } from "@/components/daily/quest-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type { DailyState } from "@/types/daily";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const session = await auth();
  if (!session?.backendAccessToken) redirect("/login");

  const daily = await api.get<DailyState>("/api/daily", {
    headers: { Authorization: `Bearer ${session.backendAccessToken}` },
  });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Daily Quests</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Login streak</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{daily.streak.current} days</p>
          <p className="text-sm text-muted-foreground">
            Longest streak: {daily.streak.longest} days
          </p>
        </CardContent>
      </Card>

      <QuestList quests={daily.quests} />
    </main>
  );
}
