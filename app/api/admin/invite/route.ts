import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { jsonFetch } from "../../../../lib/http";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { backendRole, backendAccessToken } = session as {
    backendRole?: string;
    backendAccessToken?: string;
  };
  if (backendRole !== 'Admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const {
    firstName,
    lastName,
    email,
    password,
    address,
    phone,
    photoUrl,
    role: targetRole,
  } = await req.json();
  if (!['Mentor', 'Partenaire'].includes(String(targetRole))) {
    return NextResponse.json({ error: 'role invalide' }, { status: 400 });
  }
  try {
    const reg = await jsonFetch<{ user?: { id?: string } }>(
      `/api/v1/auth/register`,
      {
        method: 'POST',
        body: {
          firstName,
          lastName,
          email,
          password,
          address,
          phone,
          photoUrl,
        },
      }
    );
    const userId = reg.user?.id;
    if (!userId)
      return NextResponse.json(
        { error: 'Création utilisateur échouée' },
        { status: 500 }
      );
    const updated = await jsonFetch(`/api/v1/users/${userId}`, {
      method: 'PATCH',
      token: backendAccessToken,
      body: { role: targetRole },
    });
    return NextResponse.json(updated, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as { message?: string })?.message || 'Erreur' },
      { status: (e as { status?: number })?.status || 500 }
    );
  }
}

