import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, BackendFields } from "../../../lib/auth";
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
      token: (session as BackendFields).backendAccessToken,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string } | undefined;
    return NextResponse.json({ error: err?.message || "Erreur" }, { status: err?.status ?? 500 });
  }
}

