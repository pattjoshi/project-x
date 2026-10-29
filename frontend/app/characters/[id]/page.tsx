import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
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
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl p-6">
        <Card className="overflow-hidden py-0">
          <div className="gradient-romantic h-20" aria-hidden />
          <CardHeader className="-mt-8">
            <div
              className="mb-2 flex size-16 items-center justify-center rounded-full border-4 border-card bg-secondary text-2xl font-semibold text-secondary-foreground"
              aria-hidden
            >
              {character.name.charAt(0)}
            </div>
            <CardTitle className="text-2xl">{character.name}</CardTitle>
            <p className="text-muted-foreground">Age {character.age}</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pb-6">
            <p>{character.bio}</p>
            <p>
              <span className="font-medium">Likes:</span> {character.likes}
            </p>
            <p>
              <span className="font-medium">Dislikes:</span> {character.dislikes}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild>
                <Link href={`/characters/${character.id}/chat`}>Start chatting</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/characters/${character.id}/chapters`}>Chapters</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
