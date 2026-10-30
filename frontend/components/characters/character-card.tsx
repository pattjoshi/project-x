import Link from "next/link";

import { CharacterBust } from "@/components/3d/character-bust";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Character } from "@/types/character";

export function CharacterCard({ character }: { character: Character }) {
  return (
    <Link href={`/characters/${character.id}`}>
      <Card className="h-full gap-3 overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
        <div className="gradient-romantic h-36 overflow-hidden" aria-hidden>
          <CharacterBust
            vrmUrl={character.vrm_model_url}
            className="h-full w-full"
          />
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
