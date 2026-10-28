import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> },
) {
  const session = await auth();
  if (!session?.backendAccessToken) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const { characterId } = await params;
  const body = await request.json();

  const res = await fetch(`${API_URL}/api/chat/${characterId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.backendAccessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
