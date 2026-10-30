import type { ChoiceStat } from "@/types/admin";

export function ChoiceStatsTable({ choices }: { choices: ChoiceStat[] }) {
  if (choices.length === 0) {
    return <p className="text-sm text-muted-foreground">No chapter choices made yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-1.5 font-normal">Chapter</th>
          <th className="py-1.5 font-normal">Node</th>
          <th className="py-1.5 font-normal">Choice</th>
          <th className="py-1.5 font-normal">Picked</th>
        </tr>
      </thead>
      <tbody>
        {choices.map((choice) => (
          <tr
            key={`${choice.chapter_id}-${choice.node_id}-${choice.choice}`}
            className="border-b last:border-0"
          >
            <td className="py-1.5">{choice.chapter_title}</td>
            <td className="py-1.5 font-mono text-xs">{choice.node_id}</td>
            <td className="py-1.5">{choice.choice}</td>
            <td className="py-1.5">{choice.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
