import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = (session as any).backendRole as string | undefined;
  if (role === 'Apprenant') redirect('/apprenant');
  if (role === 'Mentor') redirect('/mentor');
  if (role === 'Partenaire') redirect('/partenaire');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  let me: any = null;
  let error: string | null = null;
  try {
    const res = await fetch(`${apiBase}/api/v1/me`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${(session as any).backendAccessToken}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    me = await res.json();
  } catch (e: any) {
    error = e?.message || "Échec de la requête profil";
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="rounded-md border border-foreground/15 p-4">
        <div className="text-sm opacity-80">Session</div>
        <pre className="mt-2 text-xs overflow-auto">
{JSON.stringify({
  user: session.user,
  backendUserId: (session as any).backendUserId,
  backendRole: (session as any).backendRole,
}, null, 2)}
        </pre>
      </div>

      <div className="rounded-md border border-foreground/15 p-4">
        <div className="text-sm opacity-80">Backend /me</div>
        {me ? (
          <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(me, null, 2)}</pre>
        ) : (
          <div className="mt-2 text-sm">Indisponible{error ? ` • ${error}` : ""}</div>
        )}
      </div>
    </main>
  );
}
