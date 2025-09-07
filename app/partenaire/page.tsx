import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../lib/auth";
import { getMyProfile } from "../../lib/api/profile";
import { listPosts } from "../../lib/api/posts";
import PartnerPostForm from "../../components/PartnerPostForm";
import RoleDashboard from "../../components/RoleDashboard";
import Link from "next/link";

export default async function PartnerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <RoleDashboard role="Partenaire" title="Espace Partenaire">
        <p>Vous devez être connecté.</p>
      </RoleDashboard>
    );
  }
  const token = (session as BackendFields).backendAccessToken as string;
  const userId = (session as BackendFields).backendUserId as number | undefined;
  const profile = await getMyProfile(token).catch(() => null);
  if (!profile?.partenaire) {
    return (
      <RoleDashboard role="Partenaire" title="Espace Partenaire">
        <div className="card p-4">
          <div className="text-sm opacity-80">Aucun profil Partenaire détecté.</div>
          <Link href="/profile" className="mt-2 inline-flex h-9 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-sm">Créer mon profil</Link>
        </div>
      </RoleDashboard>
    );
  }
  const posts = await listPosts().catch(() => []);
  const mine = posts.filter((p) => p.userId === userId);

  return (
    <RoleDashboard role="Partenaire" title="Espace Partenaire">
      <section className="card p-4 space-y-3">
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
    </RoleDashboard>
  );
}

