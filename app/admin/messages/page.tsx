import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import { redirect } from "next/navigation";
import RoleDashboard from "../../../components/RoleDashboard";
import BackLink from "../../../components/BackLink";
import AdminMessageForm from "../../../components/AdminMessageForm";

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');

  return (
    <RoleDashboard role="Admin" title="Envoyer des messages">
      <BackLink href="/admin" />
      <section className="card p-4 space-y-3">
        <div className="text-sm opacity-70">À tous, par rôle, par IDs, ou un utilisateur unique.</div>
        <AdminMessageForm />
      </section>
    </RoleDashboard>
  );
}

