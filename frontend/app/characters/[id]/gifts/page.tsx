import { notFound, redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { PageHeading } from "@/components/layout/page-heading";
import { GiftPicker } from "@/components/gifts/gift-picker";
import { ApiError, api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type { Character } from "@/types/character";
import type { Gift } from "@/types/gift";

export const dynamic = "force-dynamic";

export default async function GiftsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.backendAccessToken) redirect("/login");

  let character: Character;
  let gifts: Gift[];
  try {
    [character, gifts] = await Promise.all([
      api.get<Character>(`/api/characters/${id}`),
      api.get<Gift[]>("/api/gifts", {
        headers: { Authorization: `Bearer ${session.backendAccessToken}` },
      }),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl p-6 pt-12">
        <PageHeading eyebrow="A little something" title={`Send ${character.name} a gift`} />
        <GiftPicker characterId={id} characterName={character.name} gifts={gifts} />
      </main>
    </>
  );
}
