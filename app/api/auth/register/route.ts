import { NextResponse } from "next/server";
import { jsonFetch } from "../../../../lib/http";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/auth/register`, { method: 'POST', body });
    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || 'Erreur' }, { status: e?.status || 500 });
  }
}

