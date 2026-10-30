import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OverviewStats } from "@/types/admin";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

export function StatCards({
  overview,
  totalCostUsd,
}: {
  overview: OverviewStats;
  totalCostUsd: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Users" value={overview.total_users} />
      <StatCard label="Messages" value={overview.total_messages} />
      <StatCard label="Gifts sent" value={overview.total_gifts_sent} />
      <StatCard label="Est. AI cost" value={`$${totalCostUsd.toFixed(4)}`} />
      {Object.entries(overview.stage_counts).map(([stage, count]) => (
        <StatCard key={stage} label={`"${stage}" relationships`} value={count} />
      ))}
    </div>
  );
}
