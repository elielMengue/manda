import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { jsonFetch } from "../../../lib/http";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await jsonFetch(`/api/v1/notifications`, { token: (session as unknown).backendAccessToken });
    return NextResponse.json(items);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || 'Erreur' }, { status: e?.status || 500 });
  }
}

