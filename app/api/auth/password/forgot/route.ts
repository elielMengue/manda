import { NextResponse } from "next/server";
import { jsonFetch } from "../../../../../lib/http";

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/auth/password/forgot`, { method: 'POST', body: { email } });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string } | undefined;
    return NextResponse.json({ error: err?.message || 'Erreur' }, { status: err?.status ?? 500 });
  }
}

