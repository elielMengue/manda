import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, BackendFields } from "../../../../lib/auth";
import { jsonFetch } from "../../../../lib/http";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { firstName, lastName, email, password, address, phone, photoUrl, role: targetRole } = await req.json();
  if (!['Mentor','Partenaire'].includes(String(targetRole))) {
    return NextResponse.json({ error: 'role invalide' }, { status: 400 });
  }
  try {
    const reg = await jsonFetch<any>(`/api/v1/auth/register`, { method: 'POST', body: { firstName, lastName, email, password, address, phone, photoUrl } });
    const userId = reg?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Création utilisateur échouée' }, { status: 500 });
    const updated = await jsonFetch(`/api/v1/users/${userId}`, { method: 'PATCH', token: (session as BackendFields).backendAccessToken, body: { role: targetRole } });
    return NextResponse.json(updated, { status: 201 });
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string } | undefined;
    return NextResponse.json({ error: err?.message || 'Erreur' }, { status: err?.status ?? 500 });
  }
}

