import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { jsonFetch } from "../../../../lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const lessonId = Number(id);
  const body = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/lessons/${lessonId}`, { method: 'PATCH', token: (session as any).backendAccessToken, body });
    return NextResponse.json(data);
  } catch (e: any) { return NextResponse.json({ error: e?.message || 'Erreur' }, { status: e?.status || 500 }); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const lessonId = Number(id);
  try {
    const data = await jsonFetch(`/api/v1/lessons/${lessonId}`, { method: 'DELETE', token: (session as any).backendAccessToken });
    return NextResponse.json(data);
  } catch (e: any) { return NextResponse.json({ error: e?.message || 'Erreur' }, { status: e?.status || 500 }); }
}

