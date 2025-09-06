import { NextResponse } from "next/server";
import { jsonFetch } from "../../../../../lib/http";

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/auth/password/forgot`, { method: 'POST', body: { email } });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur' }, { status: e?.status || 500 });
  }
}

