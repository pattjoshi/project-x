import { AppHeader } from "@/components/layout/app-header";
import { CharacterCard } from "@/components/characters/character-card";
import { Reveal } from "@/components/cinematic/reveal";
import { api } from "@/lib/api-client";
import type { Character } from "@/types/character";

export const dynamic = "force-dynamic";

export default async function CharactersPage() {
  const characters = await api.get<Character[]>("/api/characters");

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl p-6 pt-12">
        <Reveal>
          <p className="text-eyebrow text-muted-foreground">Who&apos;s free tonight</p>
          <h1 className="text-display-2 mt-2 mb-8">Characters</h1>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {characters.map((character, i) => (
            <Reveal key={character.id} delay={i * 0.08}>
              <CharacterCard character={character} />
            </Reveal>
          ))}
        </div>
      </main>
    </>
  );
}
