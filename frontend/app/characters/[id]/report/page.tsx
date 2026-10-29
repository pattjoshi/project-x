import { notFound, redirect } from "next/navigation";

import { CompatibilityReport } from "@/components/reports/compatibility-report";
import { ApiError, api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type { Character } from "@/types/character";

export const dynamic = "force-dynamic";

export default async function CompatibilityReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.backendAccessToken) redirect("/login");

  let character: Character;
  try {
    character = await api.get<Character>(`/api/characters/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Compatibility Report</h1>
      <CompatibilityReport characterId={id} characterName={character.name} />
    </main>
  );
}
