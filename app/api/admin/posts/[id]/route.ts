import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, BackendFields } from "../../../../../lib/auth";
import { jsonFetch } from "../../../../../lib/http";

export async function PATCH(_req: Request, { params, url }: { params: Promise<{ id: string }>; url: string }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const status = new URL(url).searchParams.get('status') || undefined;
  try {
    const data = await jsonFetch(`/api/v1/posts/${Number(id)}`, { method: 'PATCH', token: (session as BackendFields).backendAccessToken, body: status ? { status } : {} });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string } | undefined;
    return NextResponse.json({ error: err?.message || 'Erreur' }, { status: err?.status ?? 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const data = await jsonFetch(`/api/v1/posts/${Number(id)}`, { method: 'DELETE', token: (session as BackendFields).backendAccessToken });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string } | undefined;
    return NextResponse.json({ error: err?.message || 'Erreur' }, { status: err?.status ?? 500 });
  }
}
