import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../../lib/auth";
import { getApiBase } from "../../../../lib/http";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const base = getApiBase();
  const res = await fetch(`${base}/api/v1/uploads/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${(session as BackendFields).backendAccessToken}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json({ error: data?.error || `HTTP ${res.status}` }, { status: res.status });
  return NextResponse.json(data, { status: 201 });
}

