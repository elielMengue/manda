import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { jsonFetch } from "../../../../../lib/http";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { backendAccessToken } = session as { backendAccessToken?: string };
  const { id } = await params;
  const userId = Number(id);
  const body = await req.json();
  try {
    const data = await jsonFetch(`/api/v1/users/${userId}`, {
      method: 'PATCH',
      token: backendAccessToken,
      body,
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as { message?: string })?.message || 'Erreur' },
      { status: (e as { status?: number })?.status || 500 }
    );
  }
}

