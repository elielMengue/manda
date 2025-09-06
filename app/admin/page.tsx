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
      <section className="card p-4 space-y-3">
        <div className="text-sm opacity-70">Inviter un Mentor ou Partenaire</div>
        <AdminInviteForm />
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/admin/users" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Gérer les utilisateurs</div>
          <div className="text-sm opacity-80">Liste et contrôle des rôles</div>
        </Link>
        <Link href="/certificates/issue" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Émettre un certificat</div>
          <div className="text-sm opacity-80">Mentor/Admin</div>
        </Link>
        <Link href="/mentor" className="card p-4 hover:bg-foreground/5 transition-colors">
          <div className="font-medium">Cours et contenus</div>
          <div className="text-sm opacity-80">Accès à l’espace Mentor</div>
        </Link>
      </section>
    </RoleDashboard>
  );
}
