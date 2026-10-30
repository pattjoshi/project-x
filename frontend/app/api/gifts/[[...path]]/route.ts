import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function proxy(request: NextRequest, path: string[]) {
  const session = await auth();
  if (!session?.backendAccessToken) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const body = request.method === "POST" ? await request.text() : undefined;
  const url = path.length > 0 ? `${API_URL}/api/gifts/${path.join("/")}` : `${API_URL}/api/gifts`;

  const res = await fetch(url, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.backendAccessToken}`,
    },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  return proxy(request, path ?? []);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  return proxy(request, path ?? []);
}
