import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../../lib/auth";
import { jsonFetch } from "../../../../lib/http";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const role = (session as BackendFields).backendRole as string | undefined;
  const email = session.user?.email as string | undefined;
  if (role !== 'Admin' || !email) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { password } = await req.json();
  try {
    await jsonFetch(`/api/v1/auth/login`, { method: 'POST', body: { email, password } });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_elevated', '1', { httpOnly: true, sameSite: 'lax', maxAge: 600, path: '/', secure: process.env.NODE_ENV === 'production' });
    return res;
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || 'Invalid credentials' }, { status: 401 });
  }
}

