import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { jsonFetch } from "../../../../../lib/http";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const notifId = Number(id);
  if (!notifId) return NextResponse.json({ error: "id invalide" }, { status: 400 });
  try {
    await jsonFetch(`/api/v1/notifications/${notifId}/read`, {
      method: 'PATCH',
      token: (session as any).backendAccessToken,
    });
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erreur' }, { status: e?.status || 500 });
  }
}

