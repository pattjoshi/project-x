import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { ChapterReader } from "@/components/chapters/chapter-reader";
import { api } from "@/lib/api-client";
import { auth } from "@/lib/auth";
import type { ChapterNodeResponse } from "@/types/chapter";

export const dynamic = "force-dynamic";

export default async function ChapterReaderPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  const session = await auth();
  if (!session?.backendAccessToken) redirect("/login");

  const node = await api.get<ChapterNodeResponse>(`/api/chapters/${id}/${chapterId}`, {
    headers: { Authorization: `Bearer ${session.backendAccessToken}` },
  });

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl p-6 pt-12">
        <ChapterReader characterId={id} chapterId={chapterId} initialNode={node} />
      </main>
    </>
  );
}
