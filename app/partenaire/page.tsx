import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../lib/auth";
import { getMyProfile } from "../../lib/api/profile";
import { listPosts } from "../../lib/api/posts";
import PartnerPostForm from "../../components/PartnerPostForm";
import Link from "next/link";
import RoleDashboard from "../../components/RoleDashboard";
import DocumentManager from "../../components/DocumentManager";
import SearchList from "../../components/SearchList";

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
      <DocumentManager />
      <section className="rounded-md border border-foreground/15 p-4 space-y-3">
        <div className="text-sm opacity-70">Publier une opportunité</div>
        <PartnerPostForm />
      </section>

      <section className="space-y-3">
        <div className="text-sm opacity-70">Mes publications</div>
        <SearchList
          items={mine.map((p) => ({
            id: p.id,
            label: p.title,
            meta: `${p.typeOportunite} • ${p.status}`,
          }))}
        />
      </section>
    </RoleDashboard>
  );
}

