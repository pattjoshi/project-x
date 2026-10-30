import type { ChapterDropOff, NodeDropOff } from "@/types/admin";

export function ChapterDropoffTable({
  chapters,
  nodes,
}: {
  chapters: ChapterDropOff[];
  nodes: NodeDropOff[];
}) {
  if (chapters.length === 0) {
    return <p className="text-sm text-muted-foreground">No chapter activity yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-1.5 font-normal">Chapter</th>
            <th className="py-1.5 font-normal">Started</th>
            <th className="py-1.5 font-normal">Completed</th>
            <th className="py-1.5 font-normal">Completion rate</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => (
            <tr key={chapter.chapter_id} className="border-b last:border-0">
              <td className="py-1.5">{chapter.chapter_title}</td>
              <td className="py-1.5">{chapter.started}</td>
              <td className="py-1.5">{chapter.completed}</td>
              <td className="py-1.5">
                {chapter.started > 0
                  ? `${Math.round((chapter.completed / chapter.started) * 100)}%`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {nodes.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs text-muted-foreground">
            Where players get stuck (incomplete, grouped by current node):
          </p>
          <ul className="flex flex-col gap-1 text-sm">
            {nodes.map((node) => (
              <li key={`${node.chapter_id}-${node.node_id}`} className="text-muted-foreground">
                {node.chapter_title} → <span className="font-mono text-xs">{node.node_id}</span>:{" "}
                {node.stuck_count} stuck
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
