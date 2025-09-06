import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../lib/auth";
import { getMyProfile } from "../../lib/api/profile";
import { listPosts } from "../../lib/api/posts";
import PartnerPostForm from "../../components/PartnerPostForm";
import Link from "next/link";

export default async function PartnerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Espace Partenaire</h1>
        <p>Vous devez être connecté.</p>
      </main>
    );
  }
  const token = (session as BackendFields).backendAccessToken as string;
  const userId = (session as BackendFields).backendUserId as number | undefined;
  const profile = await getMyProfile(token).catch(() => null);
  if (!profile?.partenaire) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Espace Partenaire</h1>
        <div className="rounded-md border border-foreground/15 p-4">
          <div className="text-sm opacity-80">Aucun profil Partenaire détecté.</div>
          <Link href="/profile" className="mt-2 inline-flex h-9 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-sm">Créer mon profil</Link>
        </div>
      </main>
    );
  }
  const posts = await listPosts().catch(() => []);
  const mine = posts.filter((p) => p.userId === userId);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Espace Partenaire</h1>

      <section className="rounded-md border border-foreground/15 p-4 space-y-3">
        <div className="text-sm opacity-70">Publier une opportunité</div>
        <PartnerPostForm />
      </section>

      <section className="space-y-3">
        <div className="text-sm opacity-70">Mes publications</div>
        <div className="grid grid-cols-1 gap-3">
          {mine.map((p) => (
            <div key={p.id} className="rounded-md border border-foreground/10 p-4">
              <div className="text-sm opacity-70">{p.typeOportunite} • {p.status}</div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm opacity-80 line-clamp-2">{p.content}</div>
            </div>
          ))}
          {mine.length === 0 && <div className="text-sm opacity-70">Aucune publication pour l&apos;instant.</div>}
        </div>
      </section>
    </main>
  );
}

