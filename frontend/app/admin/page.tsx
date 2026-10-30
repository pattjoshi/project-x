import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { ChapterDropoffTable } from "@/components/admin/chapter-dropoff-table";
import { ChoiceStatsTable } from "@/components/admin/choice-stats-table";
import { CostSummaryTable } from "@/components/admin/cost-summary-table";
import { StatCards } from "@/components/admin/stat-cards";
import { api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type {
  ChapterDropOff,
  ChoiceStat,
  CostSummary,
  NodeDropOff,
  OverviewStats,
} from "@/types/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.backendAccessToken) redirect("/login");
  if (!session.user?.isAdmin) redirect("/characters");

  const authHeaders = { headers: { Authorization: `Bearer ${session.backendAccessToken}` } };

  const [overview, chapterDropoff, nodeDropoff, choices, cost] = await Promise.all([
    api.get<OverviewStats>("/api/admin/analytics/overview", authHeaders),
    api.get<ChapterDropOff[]>("/api/admin/analytics/chapter-dropoff", authHeaders),
    api.get<NodeDropOff[]>("/api/admin/analytics/node-dropoff", authHeaders),
    api.get<ChoiceStat[]>("/api/admin/analytics/choices", authHeaders),
    api.get<CostSummary>("/api/admin/analytics/cost", authHeaders),
  ]);

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>

        <StatCards overview={overview} totalCostUsd={cost.total_estimated_cost_usd} />

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Chapter drop-off</h2>
          <ChapterDropoffTable chapters={chapterDropoff} nodes={nodeDropoff} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Most common choices</h2>
          <ChoiceStatsTable choices={choices} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Estimated AI cost per user</h2>
          <p className="text-xs text-muted-foreground">
            Estimated from chat-completion token usage at gpt-4o-mini pricing. Not a metered
            bill - moderation and TTS calls aren&apos;t included.
          </p>
          <CostSummaryTable users={cost.top_users} />
        </section>
      </main>
    </>
  );
}
