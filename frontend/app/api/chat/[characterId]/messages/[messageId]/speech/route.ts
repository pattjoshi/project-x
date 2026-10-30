import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; messageId: string }> },
) {
  const session = await auth();
  if (!session?.backendAccessToken) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const { characterId, messageId } = await params;

  const res = await fetch(
    `${API_URL}/api/chat/${characterId}/messages/${messageId}/speech`,
    { headers: { Authorization: `Bearer ${session.backendAccessToken}` } },
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: "Request failed." }));
    return NextResponse.json(data, { status: res.status });
  }

  const audio = await res.arrayBuffer();
  return new NextResponse(audio, {
    status: 200,
    headers: { "Content-Type": "audio/mpeg" },
  });
}
