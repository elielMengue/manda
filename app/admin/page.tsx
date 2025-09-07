import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminInviteForm from "../../components/AdminInviteForm";
import RoleDashboard from "../../components/RoleDashboard";

interface SessionWithRole extends Session {
  backendRole?: string;
}

export default async function AdminHome() {
  const session = (await getServerSession(authOptions)) as SessionWithRole | null;
  if (!session) redirect("/login");
  if (session.backendRole !== "Admin") redirect("/");

  return (
    <RoleDashboard role="Admin" title="Espace Administrateur">
      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Kpi label="Utilisateurs" apiKey="users.total" />
        <Kpi label="Cours" apiKey="contents.courses" />
        <Kpi label="Inscriptions" apiKey="activity.inscriptions" />
        <Kpi label="Certificats" apiKey="activity.certificates" />
      </section>

      <section className="card p-4 space-y-3">
        <div className="text-sm opacity-70">Inviter un Mentor ou Partenaire</div>
        <AdminInviteForm />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/admin/users" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Gérer les utilisateurs</div>
          <div className="text-sm opacity-80">Liste, rôles, statuts</div>
        </Link>
        <Link href="/admin/courses" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Gérer les cours</div>
          <div className="text-sm opacity-80">Créer, ouvrir, supprimer</div>
        </Link>
        <Link href="/admin/posts" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Modérer les posts</div>
          <div className="text-sm opacity-80">Publier / fermer / supprimer</div>
        </Link>
        <Link href="/certificates/issue" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Émettre un certificat</div>
          <div className="text-sm opacity-80">Mentor/Admin</div>
        </Link>
        <Link href="/admin/notify" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Notifications</div>
          <div className="text-sm opacity-80">Diffusion ciblée</div>
        </Link>
        <Link href="/admin/messages" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Messages</div>
          <div className="text-sm opacity-80">Privés à tous/role/ID</div>
        </Link>
        <Link href="/admin/profile" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Profil admin</div>
          <div className="text-sm opacity-80">Informations et avatar</div>
        </Link>
      </section>
    </RoleDashboard>
  );
}

async function Kpi({ label, apiKey }: { label: string; apiKey: string }) {
  let value = '—';
  try {
    const res = await fetch(`/api/admin/metrics`, { cache: 'no-store' });
    const data: Record<string, unknown> = await res.json();
    const resolved = apiKey
      .split('.')
      .reduce<unknown>(
        (acc, k) =>
          typeof acc === 'object' && acc !== null ? (acc as Record<string, unknown>)[k] : undefined,
        data,
      );
    if (typeof resolved === 'string' || typeof resolved === 'number') {
      value = String(resolved);
    }
  } catch {}
  return (
    <div className="card p-4">
      <div className="text-xs opacity-60">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
