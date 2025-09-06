import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import { redirect } from "next/navigation";
import AdminUsersTable, { type User } from "../../../components/AdminUsersTable";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');

  let users: User[] = [];
  let error: string | null = null;
  try {
    const res = await fetch('/api/admin/users', { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    users = Array.isArray(data?.items) ? (data.items as User[]) : Array.isArray(data) ? (data as User[]) : [];
  } catch (e: unknown) {
    error = (e as { message?: string })?.message || 'Erreur';
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
