import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { jsonFetch } from "../../../../lib/http";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await jsonFetch(`/api/v1/mentors`, {
      token: (session as { backendAccessToken?: string }).backendAccessToken,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const err = e as { message?: string; status?: number };
    return NextResponse.json({ error: err.message || 'Erreur' }, { status: err.status || 500 });
  }
}

