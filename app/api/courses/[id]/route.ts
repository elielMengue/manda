import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../../lib/auth";
import { jsonFetch } from "../../../../lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/cours/${Number(id)}`, {
      method: 'PATCH',
      token: (session as BackendFields).backendAccessToken,
      body,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const { message, status } = e as { message?: string; status?: number };
    return NextResponse.json({ error: message || 'Erreur' }, { status: status || 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const data = await jsonFetch(`/api/v1/cours/${Number(id)}`, {
      method: 'DELETE',
      token: (session as BackendFields).backendAccessToken,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const { message, status } = e as { message?: string; status?: number };
    return NextResponse.json({ error: message || 'Erreur' }, { status: status || 500 });
  }
}

