import Link from "next/link";
import { getCours } from "../../../lib/api/courses";
import EnrollButton from "../../../components/EnrollButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import AddModuleForm from "../../../components/AddModuleForm";
import DeleteButton from "../../../components/DeleteButton";

export default async function CoursDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coursId = Number(id);
  const [session, cours] = await Promise.all([
    getServerSession(authOptions),
    getCours(coursId),
  ]);
  const role = (session as any)?.backendRole as string | undefined;

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
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
