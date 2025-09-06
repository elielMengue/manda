import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { jsonFetch } from "../../../lib/http";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const coursId = Number(body.coursId);
  if (!coursId) return NextResponse.json({ error: "coursId requis" }, { status: 400 });

  try {
    const data = await jsonFetch(`/api/v1/cours/${coursId}/enroll`, {
      method: "POST",
      token: (session as unknown).backendAccessToken,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || "Erreur" }, { status: e?.status || 500 });
  }
}

