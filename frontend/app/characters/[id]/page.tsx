import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, api } from "@/lib/api-client";
import type { Character } from "@/types/character";

export const dynamic = "force-dynamic";

export default async function CharacterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let character: Character;
  try {
    character = await api.get<Character>(`/api/characters/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{character.name}</CardTitle>
          <p className="text-muted-foreground">Age {character.age}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p>{character.bio}</p>
          <p>
            <span className="font-medium">Likes:</span> {character.likes}
          </p>
          <p>
            <span className="font-medium">Dislikes:</span> {character.dislikes}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
