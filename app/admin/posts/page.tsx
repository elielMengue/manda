import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import { redirect } from "next/navigation";
import RoleDashboard from "../../../components/RoleDashboard";
import BackLink from "../../../components/BackLink";
import DeleteButton from "../../../components/DeleteButton";

type Post = { id: number; title: string; content: string; status: string; typeOportunite: string; datePublication: string };

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');

  let items: Post[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/posts`, { cache: 'no-store' });
    const data = await res.json();
    if (res.ok && Array.isArray(data)) items = data;
  } catch {}

  return (
    <RoleDashboard role="Admin" title="Modération des posts">
      <BackLink href="/admin" />
      <section className="space-y-3">
        <div className="text-sm opacity-70">Tous les posts</div>
        <div className="table-3d">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Titre</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Statut</th>
                <th className="text-left p-2">Publié</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-foreground/10">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.title}</td>
                  <td className="p-2">{p.typeOportunite}</td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2 text-xs opacity-70">{new Date(p.datePublication).toLocaleDateString()}</td>
                  <td className="p-2 flex gap-2">
                    <form action={`/api/admin/posts/${p.id}`} method="post" className="inline">
                      <input type="hidden" name="_method" value="PATCH" />
                      <input type="hidden" name="status" value={p.status === 'open' ? 'closed' : 'open'} />
                      <button className="btn-outline h-8 text-xs" formAction={`/api/admin/posts/${p.id}?status=${p.status === 'open' ? 'closed' : 'open'}`}>Basculer</button>
                    </form>
                    <DeleteButton url={`/api/admin/posts/${p.id}`} label="Supprimer" confirmText="Supprimer ce post ?" />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-3 text-sm opacity-70">Aucun post</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </RoleDashboard>
  );
}
