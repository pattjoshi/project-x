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
  return (
    <Link href={`/characters/${character.id}`}>
      <Card className="h-full transition-colors hover:border-primary">
        <CardHeader>
          <CardTitle>{character.name}</CardTitle>
          <CardDescription>Age {character.age}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{character.bio}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
