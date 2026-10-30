import { notFound, redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { PageHeading } from "@/components/layout/page-heading";
import { CharacterChatExperience } from "@/components/chat/character-chat-experience";
import { ApiError, api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type { RelationshipPublic } from "@/types/chat";
import type { Character } from "@/types/character";

export const dynamic = "force-dynamic";

export default async function CharacterChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.backendAccessToken) redirect("/login");

  let character: Character;
  let relationship: RelationshipPublic;
  try {
    [character, relationship] = await Promise.all([
      api.get<Character>(`/api/characters/${id}`),
      api.get<RelationshipPublic>(`/api/relationships/${id}`, {
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
        <PageHeading eyebrow="Your date" title={`Chat with ${character.name}`} />
        <CharacterChatExperience
          characterId={id}
          characterName={character.name}
          vrmUrl={character.vrm_model_url}
          initialRelationship={relationship}
        />
      </main>
    </>
  );
}
