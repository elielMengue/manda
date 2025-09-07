import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, BackendFields } from "../../../../../lib/auth";
import { jsonFetch } from "../../../../../lib/http";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const lessonId = Number(id);
  if (!lessonId) return NextResponse.json({ error: "id invalide" }, { status: 400 });

  try {
    const data = await jsonFetch(`/api/v1/lessons/${lessonId}/complete`, {
      method: "POST",
      token: (session as BackendFields).backendAccessToken,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string } | undefined;
    return NextResponse.json({ error: err?.message || "Erreur" }, { status: err?.status ?? 500 });
  }
}

