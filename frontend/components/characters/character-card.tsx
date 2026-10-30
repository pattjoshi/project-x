import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Character } from "@/types/character";

export function CharacterCard({ character }: { character: Character }) {
  const initial = character.name.charAt(0);

  return (
    <Link href={`/characters/${character.id}`}>
      <Card className="h-full gap-3 overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
        <div className="gradient-romantic flex h-28 items-end p-4" aria-hidden>
          <span className="flex size-12 items-center justify-center rounded-full bg-white/20 text-lg font-semibold text-white backdrop-blur-sm">
            {initial}
          </span>
        </div>
        <CardHeader className="gap-0 pt-1">
          <h3 className="text-display-3">{character.name}</h3>
          <p className="text-sm text-muted-foreground">Age {character.age}</p>
        </CardHeader>
        <CardContent className="pb-5">
          <p className="text-sm text-muted-foreground">{character.bio}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
