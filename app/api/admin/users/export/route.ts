import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, BackendFields } from "../../../../../lib/auth";
import { getApiBase } from "../../../../../lib/http";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const base = getApiBase();
  const res = await fetch(`${base}/api/v1/admin/users/export`, {
    headers: { Authorization: `Bearer ${(session as BackendFields).backendAccessToken}` },
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) return NextResponse.json({ error: text || 'Erreur' }, { status: res.status });
  return new NextResponse(text, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="users.csv"',
    },
  });
}
