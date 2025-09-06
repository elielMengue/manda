import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import RoleDashboard from "../../../../components/RoleDashboard";
import BackLink from "../../../../components/BackLink";
import AdminEditCourseForm from "../../../../components/AdminEditCourseForm";

export default async function AdminEditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Admin') redirect('/');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const res = await fetch(`${apiBase}/api/v1/cours/${id}`, { cache: 'no-store' });
  if (!res.ok) redirect('/admin/courses');
  const cours = await res.json();

  return (
    <RoleDashboard role="Admin" title={`Éditer le cours #${cours.id}`}>
      <BackLink href="/admin/courses" />
      <section className="card p-4 space-y-3">
        <AdminEditCourseForm id={cours.id} initial={{ titre: cours.titre, description: cours.description, duree: cours.duree, status: cours.status, imageUrl: cours.imageUrl }} />
      </section>
    </RoleDashboard>
  );
}
