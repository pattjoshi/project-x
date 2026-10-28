import type { RelationshipPublic } from "@/types/chat";

function Meter({ label, value }: { label: string; value: number }) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div
          className="h-1.5 rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function RelationshipMeters({
  relationship,
}: {
  relationship: RelationshipPublic;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <p className="text-sm font-medium capitalize">{relationship.stage}</p>
      <Meter label="Affection" value={relationship.affection} />
      <Meter label="Trust" value={relationship.trust} />
      <Meter label="Chemistry" value={relationship.chemistry} />
    </div>
  );
}
