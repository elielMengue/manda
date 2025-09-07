import { NextResponse } from "next/server";
import { jsonFetch } from "../../../../../lib/http";

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/auth/password/forgot`, { method: 'POST', body: { email } });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const { message, status } = e as { message?: string; status?: number };
    return NextResponse.json({ error: message || "Erreur" }, { status: status || 500 });
  }
}

