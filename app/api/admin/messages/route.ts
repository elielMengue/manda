import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { jsonFetch } from "../../../../lib/http";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/admin/messages`, { method: 'POST', token: (session as any).backendAccessToken, body });
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e?.message || 'Erreur' }, { status: e?.status || 500 }); }
}

