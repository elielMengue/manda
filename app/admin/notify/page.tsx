import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import { redirect } from "next/navigation";
import RoleDashboard from "../../../components/RoleDashboard";
import BackLink from "../../../components/BackLink";
import AdminNotifyForm from "../../../components/AdminNotifyForm";

export default async function AdminNotifyPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');

  return (
    <RoleDashboard role="Admin" title="Envoyer une notification">
      <BackLink href="/admin" />
      <section className="card p-4 space-y-3">
        <div className="text-sm opacity-70">Destinataires: tous, par rôle ou par liste d’IDs.</div>
        <AdminNotifyForm />
      </section>
    </RoleDashboard>
  );
}
