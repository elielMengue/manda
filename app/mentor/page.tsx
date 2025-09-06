import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getMyProfile } from "../../lib/api/profile";
import { listCours } from "../../lib/api/courses";
import MentorCourseForm from "../../components/MentorCourseForm";
import RoleDashboard from "../../components/RoleDashboard";
import Link from "next/link";

interface SessionWithToken extends Session {
  backendAccessToken?: string;
}

export default async function MentorDashboard() {
  const session = (await getServerSession(authOptions)) as SessionWithToken | null;
  if (!session) {
    return (
      <RoleDashboard role="Mentor" title="Espace Mentor">
        <p>Vous devez être connecté.</p>
      </RoleDashboard>
    );
  }
  const token = session.backendAccessToken || "";
  const profile = await getMyProfile(token).catch(() => null);
  if (!profile?.mentor) {
    return (
      <RoleDashboard role="Mentor" title="Espace Mentor">
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-sm opacity-80">Aucun profil Mentor détecté.</div>
          <Link href="/profile" className="mt-2 inline-flex h-9 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-sm transition-colors">Créer mon profil</Link>
        </div>
      </RoleDashboard>
    );
  }
  const mentorId = profile.mentor.id;
  const all = await listCours({ page: 1, pageSize: 100 }).catch(() => ({ items: [], total: 0, page: 1, pageSize: 100 }));
  const mine = all.items.filter((c) => c.mentorId === mentorId);

  return (
    <RoleDashboard role="Mentor" title="Espace Mentor">
      <section className="rounded-md border border-foreground/15 p-4 space-y-3">
        <div className="text-sm opacity-70">Créer un nouveau cours</div>
        <MentorCourseForm />
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-xs opacity-60">Cours publiés</div>
          <div className="text-2xl font-semibold">{mine.length}</div>
        </div>
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-xs opacity-60">Modules/Leçons</div>
          <div className="text-2xl font-semibold">–</div>
        </div>
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-xs opacity-60">Quizzes</div>
          <div className="text-2xl font-semibold">–</div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm opacity-70">Mes cours</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mine.map((c) => (
            <Link key={c.id} href={`/courses/${c.id}`} className="rounded-md border border-foreground/10 p-4 hover:bg-foreground/5 transition-colors">
              <div className="font-medium line-clamp-2">{c.titre}</div>
              <div className="text-sm opacity-80 mt-1">{c.duree} min</div>
            </Link>
          ))}
        </div>
      </section>
    </RoleDashboard>
  );
}
