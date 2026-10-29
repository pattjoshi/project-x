import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Character } from "@/types/character";

export function CharacterCard({ character }: { character: Character }) {
  const initial = character.name.charAt(0);

  return (
    <Link href={`/characters/${character.id}`}>
      <Card className="h-full gap-3 py-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
        <CardHeader className="gap-0">
          <div
            className="gradient-romantic mb-3 flex size-12 items-center justify-center rounded-full text-lg font-semibold text-white"
            aria-hidden
          >
            {initial}
          </div>
          <CardTitle>{character.name}</CardTitle>
          <CardDescription>Age {character.age}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{character.bio}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
