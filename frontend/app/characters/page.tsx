import { CharacterCard } from "@/components/characters/character-card";
import { api } from "@/lib/api-client";
import type { Character } from "@/types/character";

export const dynamic = "force-dynamic";

export default async function CharactersPage() {
  const characters = await api.get<Character[]>("/api/characters");

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Characters</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </main>
  );
}
