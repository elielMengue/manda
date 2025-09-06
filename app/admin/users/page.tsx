import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import AdminUsersTable from "../../../components/AdminUsersTable";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as any).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');

  let users: any[] = [];
  let error: string | null = null;
  try {
    const res = await fetch('/api/admin/users', { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    users = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  } catch (e: any) {
    error = e?.message || 'Erreur';
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Utilisateurs</h1>
      {error ? (
        <div className="rounded-md border border-red-500/40 p-3 text-sm">{error}</div>
      ) : (
        <AdminUsersTable initial={users} />
      )}
    </main>
  );
}
