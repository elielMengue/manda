import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getMyProfile } from "../../lib/api/profile";
import { listMyInscriptions } from "../../lib/api/inscriptions";
import RoleDashboard from "../../components/RoleDashboard";
import Link from "next/link";

interface SessionWithToken extends Session {
  backendAccessToken?: string;
}

export default async function ApprenantDashboard() {
  const session = (await getServerSession(authOptions)) as SessionWithToken | null;
  if (!session) {
    return (
      <RoleDashboard role="Apprenant" title="Espace Apprenant">
        <p>Vous devez être connecté.</p>
      </RoleDashboard>
    );
  }
  const token = session.backendAccessToken || "";
  const profile = await getMyProfile(token).catch(() => null);
  if (!profile?.apprenant) {
    return (
      <RoleDashboard role="Apprenant" title="Espace Apprenant">
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-sm opacity-80">Aucun profil Apprenant détecté.</div>
          <Link href="/profile" className="mt-2 inline-flex h-9 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-sm transition-colors">Créer mon profil</Link>
        </div>
      </RoleDashboard>
    );
  }
  const inscriptions = await listMyInscriptions(token).catch(() => []);
  const avg = inscriptions.length ? Math.round(inscriptions.reduce((a, b) => a + b.progression, 0) / inscriptions.length) : 0;

  return (
    <RoleDashboard role="Apprenant" title="Espace Apprenant">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-xs opacity-60">Cours suivis</div>
          <div className="text-2xl font-semibold">{inscriptions.length}</div>
        </div>
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-xs opacity-60">Progression moyenne</div>
          <div className="text-2xl font-semibold">{avg}%</div>
        </div>
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-xs opacity-60">Notifications</div>
          <div className="text-2xl font-semibold">–</div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm opacity-70">Mes cours</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inscriptions.slice(0, 6).map((ins) => (
            <Link key={ins.id} href={`/courses/${ins.coursId}`} className="rounded-md border border-foreground/10 p-4 hover:bg-foreground/5 transition-colors">
              <div className="font-medium line-clamp-2">{ins.cours.titre}</div>
              <div className="text-sm opacity-80 mt-1">Progression: {ins.progression}%</div>
            </Link>
          ))}
        </div>
        <div>
          <Link href="/my/courses" className="inline-flex h-9 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-sm transition-colors">Voir tout</Link>
        </div>
      </section>
    </RoleDashboard>
  );
}

