import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import { redirect } from "next/navigation";
import RoleDashboard from "../../../components/RoleDashboard";
import BackLink from "../../../components/BackLink";
import AdminCourseForm from "../../../components/AdminCourseForm";
import DeleteButton from "../../../components/DeleteButton";

type Cours = { id: number; titre: string; description: string; duree: number; status: string; imageUrl: string; mentorId: number };

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');

  let items: Cours[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/cours?page=1&pageSize=200`, { cache: 'no-store' });
    const data = await res.json();
    if (res.ok) items = Array.isArray(data?.items) ? data.items : [];
  } catch {}

  return (
    <RoleDashboard role="Admin" title="Gérer les cours">
      <BackLink href="/admin" />
      <section className="card p-4 space-y-3">
        <div className="text-sm opacity-70">Créer un cours (Admin)</div>
        <AdminCourseForm />
      </section>

      <section className="space-y-3">
        <div className="text-sm opacity-70">Tous les cours ({items.length})</div>
        <div className="table-3d">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Titre</th>
                <th className="text-left p-2">Durée</th>
                <th className="text-left p-2">Statut</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-foreground/10">
                  <td className="p-2">{c.id}</td>
                  <td className="p-2">{c.titre}</td>
                  <td className="p-2">{c.duree} min</td>
                  <td className="p-2">{c.status}</td>
                  <td className="p-2 flex gap-2">
                    <a href={`/courses/${c.id}`} className="btn-outline h-8 text-xs">Ouvrir</a>
                    <DeleteButton url={`/api/admin/courses/${c.id}`} label="Supprimer" confirmText="Supprimer ce cours ?" />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-sm opacity-70">Aucun cours</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </RoleDashboard>
  );
}
