import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getMyProfile } from "../../lib/api/profile";
import { listMyInscriptions } from "../../lib/api/inscriptions";

export default async function ApprenantDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Espace Apprenant</h1>
        <p>Vous devez être connecté.</p>
      </main>
    );
  }
  const token = (session as any).backendAccessToken as string;
  const profile = await getMyProfile(token).catch(() => null);
  if (!profile?.apprenant) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Espace Apprenant</h1>
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-sm opacity-80">Aucun profil Apprenant détecté.</div>
          <a href="/profile" className="mt-2 inline-flex h-9 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-sm">Créer mon profil</a>
        </div>
      </main>
    );
  }
  const inscriptions = await listMyInscriptions(token).catch(() => []);
  const avg = inscriptions.length ? Math.round(inscriptions.reduce((a, b) => a + b.progression, 0) / inscriptions.length) : 0;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Espace Apprenant</h1>
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
            <a key={ins.id} href={`/courses/${ins.coursId}`} className="rounded-md border border-foreground/10 p-4 hover:bg-foreground/5">
              <div className="font-medium line-clamp-2">{ins.cours.titre}</div>
              <div className="text-sm opacity-80 mt-1">Progression: {ins.progression}%</div>
            </a>
          ))}
        </div>
        <div>
          <a href="/my/courses" className="inline-flex h-9 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-sm">Voir tout</a>
        </div>
      </section>
    </main>
  );
}

