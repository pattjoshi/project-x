import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { CharacterBust } from "@/components/3d/character-bust";
import { Magnetic } from "@/components/cinematic/magnetic";
import { Reveal } from "@/components/cinematic/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      <main className="mx-auto max-w-2xl p-6 pt-12">
        <Reveal>
          <Card className="overflow-hidden py-0">
            <div className="gradient-romantic h-56 overflow-hidden" aria-hidden>
              <CharacterBust vrmUrl={character.vrm_model_url} className="h-full w-full" />
            </div>
            <CardHeader className="pt-4">
              <h1 className="text-display-2">{character.name}</h1>
              <p className="text-muted-foreground">Age {character.age}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pb-8">
              <p>{character.bio}</p>
              <p>
                <span className="font-medium">Likes:</span> {character.likes}
              </p>
              <p>
                <span className="font-medium">Dislikes:</span> {character.dislikes}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Magnetic>
                  <Button asChild data-cursor-hover>
                    <Link href={`/characters/${character.id}/chat`}>Start chatting</Link>
                  </Button>
                </Magnetic>
                <Button asChild variant="outline">
                  <Link href={`/characters/${character.id}/chapters`}>Chapters</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/characters/${character.id}/gifts`}>Gifts</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/characters/${character.id}/report`}>Compatibility Report</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </main>
    </>
  );
}
