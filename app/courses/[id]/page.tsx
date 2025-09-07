import Link from "next/link";
import { getCours } from "../../../lib/api/courses";
import EnrollButton from "../../../components/EnrollButton";
import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import AddModuleForm from "../../../components/AddModuleForm";
import MentorEditCourseForm from "../../../components/MentorEditCourseForm";
import BackLink from "../../../components/BackLink";
import DeleteButton from "../../../components/DeleteButton";

export default async function CoursDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coursId = Number(id);
  const [session, cours] = await Promise.all([
    getServerSession(authOptions),
    getCours(coursId),
  ]);
  const role = (session as BackendFields)?.backendRole as string | undefined;
  let inscriptions: Array<{ id: number; apprenantUserId: number; apprenantName: string; apprenantEmail: string; progression: number; inscriptionDate: string; status: string }> = [];
  if (role === 'Mentor' || role === 'Admin') {
    try {
      const res = await fetch(`/api/courses/${coursId}/inscriptions`, { cache: 'no-store' });
      if (res.ok) inscriptions = await res.json();
    } catch {}
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <BackLink href={role==='Mentor'||role==='Admin' ? '/mentor' : '/courses'} />
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-2/3">
          <div className="aspect-video rounded-md overflow-hidden bg-foreground/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cours.imageUrl} alt={cours.titre} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="sm:w-1/3 space-y-3">
          <h1 className="text-2xl font-semibold">{cours.titre}</h1>
          <div className="text-sm opacity-70">{cours.status} • {cours.duree} min</div>
          <p className="text-sm opacity-80">{cours.description}</p>
          <EnrollButton coursId={cours.id} />
        </div>
      </div>

      {(role === 'Mentor' || role === 'Admin') && (
        <section className="rounded-md border border-foreground/15 p-4">
          <div className="text-sm opacity-70 mb-2">Modifier le cours</div>
          <MentorEditCourseForm id={cours.id} initial={{ titre: cours.titre, description: cours.description, duree: cours.duree, status: cours.status, imageUrl: cours.imageUrl }} />
        </section>
      )}

      {(role === 'Mentor' || role === 'Admin') && (
        <section className="rounded-md border border-foreground/15 p-4">
          <div className="text-sm opacity-70 mb-2">Inscriptions</div>
          <div className="text-sm opacity-80 mb-3">Total: {inscriptions.length}</div>
          {inscriptions.length ? (
            <div className="table-3d">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Apprenant</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Progression</th>
                    <th className="text-left p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.slice(0, 20).map((i) => (
                    <tr key={i.id} className="border-t border-foreground/10">
                      <td className="p-2">{i.apprenantName || ('#' + i.apprenantUserId)}</td>
                      <td className="p-2">{i.apprenantEmail}</td>
                      <td className="p-2">{i.progression}%</td>
                      <td className="p-2">{i.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm opacity-70">Aucune inscription pour l&apos;instant.</div>
          )}
        </section>
      )}

      <section>
        <h2 className="text-xl font-medium mb-3">Modules</h2>
        {role === 'Mentor' || role === 'Admin' ? (
          <div className="mb-4 rounded-md border border-foreground/15 p-4">
            <div className="text-sm opacity-70 mb-2">Ajouter un module</div>
            <AddModuleForm coursId={cours.id} />
          </div>
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(cours.modules || []).sort((a, b) => a.ordre - b.ordre).map(m => (
            <div key={m.id} className="rounded-md border border-foreground/10 p-4">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/modules/${m.id}`} className="flex-1 hover:underline">
                  <div className="text-sm opacity-70">Ordre {m.ordre} • {m.duree} min</div>
                  <div className="font-medium">{m.titre}</div>
                  <div className="text-sm opacity-80 line-clamp-2">{m.description}</div>
                </Link>
                {(role === 'Mentor' || role === 'Admin') ? (
                  <DeleteButton url={`/api/modules/${m.id}`} label="Supprimer" confirmText="Supprimer ce module ?" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <Link href="/courses" className="inline-block px-3 py-2 rounded-md border hover:bg-foreground/5">← Retour</Link>
      </div>
    </main>
  );
}
