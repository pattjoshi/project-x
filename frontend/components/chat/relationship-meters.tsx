import type { RelationshipPublic } from "@/types/chat";

const METER_COLORS: Record<string, string> = {
  Affection: "bg-primary",
  Trust: "bg-accent",
  Chemistry: "bg-destructive",
};

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
          className={`h-1.5 rounded-full transition-all duration-500 ${METER_COLORS[label] ?? "bg-primary"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

const STAGE_LABELS: Record<string, string> = {
  stranger: "Stranger",
  friend: "Friend",
  close: "Close",
  dating: "Dating",
};

export function RelationshipMeters({
  relationship,
}: {
  relationship: RelationshipPublic;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
      <span className="w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
        {STAGE_LABELS[relationship.stage] ?? relationship.stage}
      </span>
      <Meter label="Affection" value={relationship.affection} />
      <Meter label="Trust" value={relationship.trust} />
      <Meter label="Chemistry" value={relationship.chemistry} />
    </div>
  );
}
