import { NextResponse } from "next/server";
import { jsonFetch } from "../../../../../lib/http";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/auth/password/reset`, { method: 'POST', body: { token, password } });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string } | undefined;
    return NextResponse.json({ error: err?.message || 'Erreur' }, { status: err?.status ?? 500 });
  }
}

