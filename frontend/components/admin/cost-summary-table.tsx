import type { UserCost } from "@/types/admin";

export function CostSummaryTable({ users }: { users: UserCost[] }) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No metered chat messages yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-1.5 font-normal">User</th>
          <th className="py-1.5 font-normal">Messages</th>
          <th className="py-1.5 font-normal">Tokens (prompt / completion)</th>
          <th className="py-1.5 font-normal">Est. cost</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.user_id} className="border-b last:border-0">
            <td className="py-1.5">{user.display_name}</td>
            <td className="py-1.5">{user.message_count}</td>
            <td className="py-1.5">
              {user.prompt_tokens.toLocaleString()} / {user.completion_tokens.toLocaleString()}
            </td>
            <td className="py-1.5">${user.estimated_cost_usd.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
