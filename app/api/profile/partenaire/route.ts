import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { jsonFetch } from "../../../../lib/http";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  try {
    const out = await jsonFetch(`/api/v1/profiles/partenaire`, {
      method: 'POST',
      token: (session as unknown).backendAccessToken,
      body,
    });
    return NextResponse.json(out);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || 'Erreur' }, { status: e?.status || 500 });
  }
}

