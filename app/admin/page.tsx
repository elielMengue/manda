import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import AdminInviteForm from "../../components/AdminInviteForm";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as any).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Espace Administrateur</h1>
      <section className="rounded-md border border-foreground/15 p-4 space-y-3">
        <div className="text-sm opacity-70">Inviter un Mentor ou Partenaire</div>
        <AdminInviteForm />
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a href="/admin/users" className="rounded-md border border-foreground/10 p-4 hover:bg-foreground/5">
          <div className="font-medium">Gérer les utilisateurs</div>
          <div className="text-sm opacity-80">Liste et contrôle des rôles</div>
        </a>
        <a href="/certificates/issue" className="rounded-md border border-foreground/10 p-4 hover:bg-foreground/5">
          <div className="font-medium">Émettre un certificat</div>
          <div className="text-sm opacity-80">Mentor/Admin</div>
        </a>
        <a href="/mentor" className="rounded-md border border-foreground/10 p-4 hover:bg-foreground/5">
          <div className="font-medium">Cours et contenus</div>
          <div className="text-sm opacity-80">Accès à l’espace Mentor</div>
        </a>
      </section>
    </main>
  );
}
