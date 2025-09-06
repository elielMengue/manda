import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import AdminElevateForm from "../../../components/AdminElevateForm";

export default async function AdminSecurePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as any).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Vérification Admin</h1>
      <p className="text-sm opacity-80">Par sécurité, saisissez votre mot de passe pour accéder au tableau de bord admin.</p>
      <AdminElevateForm email={(session as any)?.user?.email} />
    </main>
  );
}
