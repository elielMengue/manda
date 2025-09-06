import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getMyProfile } from "../../lib/api/profile";
import { getMyMentorCoursesSummary } from "../../lib/api/mentor";
import { listPosts } from "../../lib/api/posts";
import MentorCourseForm from "../../components/MentorCourseForm";
import RoleDashboard from "../../components/RoleDashboard";
import Link from "next/link";
import BackLink from "../../components/BackLink";
import MentorNav from "../../components/MentorNav";

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
        <div className="card p-4">
          <div className="text-sm opacity-80">Aucun profil Mentor détecté.</div>
          <Link href="/profile" className="mt-2 inline-flex h-9 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-sm transition-colors">Créer mon profil</Link>
        </div>
      </RoleDashboard>
    );
  }

  const [summary, posts] = await Promise.all([
    getMyMentorCoursesSummary(token).catch(() => null),
    listPosts().catch(() => []),
  ]);
  const published = (summary?.items || []).filter((c) => String(c.status || '').toLowerCase() === 'published');

  return (
    <RoleDashboard role="Mentor" title="Espace Mentor">
      <BackLink href="/" label="Accueil" />
      <div className="mt-2"><MentorNav /></div>

      <section className="card p-4 space-y-3">
        <div className="text-sm opacity-70">Créer un nouveau cours</div>
        <MentorCourseForm />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="text-xs opacity-60">Cours publiés</div>
          <div className="text-2xl font-semibold">{published.length}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs opacity-60">Modules</div>
          <div className="text-2xl font-semibold">{summary?.totals.modules ?? '—'}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs opacity-60">Quizzes</div>
          <div className="text-2xl font-semibold">{summary?.totals.quizzes ?? '—'}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs opacity-60">Inscrits</div>
          <div className="text-2xl font-semibold">{summary?.totals.inscriptions ?? '—'}</div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm opacity-70">Mes cours publiés</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {published.map((c) => {
            const s = summary?.items.find((it) => it.id === c.id);
            return (
              <Link key={c.id} href={`/courses/${c.id}`} className="card p-4 hover:bg-foreground/5 transition-colors">
                <div className="font-medium line-clamp-2">{c.titre}</div>
                <div className="text-xs opacity-70 mt-1">{c.duree} min • {c.status}</div>
                <div className="text-xs opacity-70 mt-2">{s ? `${s.modulesCount} modules • ${s.lessonsCount} leçons • ${s.quizzesCount} quizzes • ${s.inscriptionsCount} inscrits` : ''}</div>
              </Link>
            );
          })}
          {published.length === 0 && (
            <div className="text-sm opacity-70">Aucun cours publié pour l’instant. Modifiez un cours en « published » pour l’afficher ici.</div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm opacity-70">Posts des administrateurs et partenaires</div>
        <div className="grid grid-cols-1 gap-3">
          {posts.slice(0, 10).map((p) => (
            <div key={p.id} className="rounded-md border border-foreground/10 p-4">
              <div className="text-sm opacity-70">{p.typeOportunite} • {new Date(p.datePublication).toLocaleDateString()}</div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm opacity-80 line-clamp-2">{p.content}</div>
            </div>
          ))}
          {posts.length === 0 && <div className="text-sm opacity-70">Aucun post pour l’instant.</div>}
        </div>
      </section>
    </RoleDashboard>
  );
}
