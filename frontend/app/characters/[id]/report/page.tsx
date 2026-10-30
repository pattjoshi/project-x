import { notFound, redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { PageHeading } from "@/components/layout/page-heading";
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
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl p-6 pt-12">
        <PageHeading eyebrow="Are you compatible" title="Compatibility Report" />
        <CompatibilityReport characterId={id} characterName={character.name} />
      </main>
    </>
  );
}
