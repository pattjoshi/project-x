import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { PageHeading } from "@/components/layout/page-heading";
import { Reveal } from "@/components/cinematic/reveal";
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
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl p-6 pt-12">
        <PageHeading eyebrow="Show up for them" title="Daily Quests" />

        <Reveal>
          <Card className="gradient-romantic mb-6 border-0 text-white">
            <CardHeader>
              <CardTitle className="text-base text-white/90">Login streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">
                {daily.streak.current} <span className="text-lg font-normal">days</span>
              </p>
              <p className="text-sm text-white/80">
                Longest streak: {daily.streak.longest} days
              </p>
            </CardContent>
          </Card>
        </Reveal>

        <QuestList quests={daily.quests} />
      </main>
    </>
  );
}
