import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type { Character } from "@/types/character";
import type { ChapterSummary } from "@/types/chapter";

export const dynamic = "force-dynamic";

export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.backendAccessToken) redirect("/login");

  let character: Character;
  let chapters: ChapterSummary[];
  try {
    [character, chapters] = await Promise.all([
      api.get<Character>(`/api/characters/${id}`),
      api.get<ChapterSummary[]>(`/api/chapters/${id}`, {
        headers: { Authorization: `Bearer ${session.backendAccessToken}` },
      }),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">{character.name}&apos;s Chapters</h1>

      {chapters.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No chapters unlocked yet — build your relationship with {character.name} first.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {chapters.map((chapter) => (
          <Link key={chapter.id} href={`/characters/${id}/chapters/${chapter.id}`}>
            <Card className="transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {chapter.title}
                  {chapter.completed && (
                    <span className="text-xs font-normal text-muted-foreground">Completed</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
