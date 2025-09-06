import Link from "next/link";
import { getModule, listLessonsForModule } from "../../../lib/api/modules";
import { listQuizzesForModule } from "../../../lib/api/quizzes";
import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import AddLessonForm from "../../../components/AddLessonForm";
import AddQuizForm from "../../../components/AddQuizForm";
import EditModuleForm from "../../../components/EditModuleForm";
import DeleteButton from "../../../components/DeleteButton";

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const moduleId = Number(id);
  const [session, module, lessons, quizzes] = await Promise.all([
    getServerSession(authOptions),
    getModule(moduleId),
    listLessonsForModule(moduleId),
    listQuizzesForModule(moduleId),
  ]);
  const role = (session as BackendFields)?.backendRole as string | undefined;

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{module.titre}</h1>
        <div className="text-sm opacity-70">{module.duree} min • Ordre {module.ordre}</div>
      </div>
      <p className="text-sm opacity-80">{module.description}</p>
      {(role === 'Mentor' || role === 'Admin') ? (
        <section className="rounded-md border border-foreground/15 p-4">
          <div className="text-sm opacity-70 mb-2">Modifier le module</div>
          <EditModuleForm moduleId={module.id} initial={{ titre: module.titre, description: module.description, ordre: module.ordre, duree: module.duree }} />
        </section>
      ) : null}

      <section>
        <h2 className="text-xl font-medium mb-3">Leçons</h2>
        {(role === 'Mentor' || role === 'Admin') ? (
          <div className="mb-3 rounded-md border border-foreground/15 p-4">
            <div className="text-sm opacity-70 mb-2">Ajouter une leçon</div>
            <AddLessonForm moduleId={module.id} />
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-2">
          {lessons.sort((a, b) => a.ordre - b.ordre).map((l) => (
            <div key={l.id} className="rounded-md border border-foreground/10 p-4">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/lessons/${l.id}`} className="flex-1">
                  <div className="text-sm opacity-70">{l.type} • {l.duree} min • Ordre {l.ordre}</div>
                  <div className="font-medium">{l.titre}</div>
                </Link>
                {(role === 'Mentor' || role === 'Admin') ? (
                  <DeleteButton url={`/api/lessons/${l.id}`} label="Supprimer" confirmText="Supprimer cette leçon ?" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">Quizzes</h2>
        {(role === 'Mentor' || role === 'Admin') ? (
          <div className="mb-3 rounded-md border border-foreground/15 p-4">
            <div className="text-sm opacity-70 mb-2">Créer un quiz</div>
            <AddQuizForm moduleId={module.id} />
          </div>
        ) : null}
        {quizzes.length === 0 ? (
          <div className="text-sm opacity-70">Aucun quiz pour ce module.</div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {quizzes.map((q) => (
              <div key={q.id} className="rounded-md border border-foreground/10 p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/quizzes/${q.id}`} className="flex-1">
                    <div className="text-sm opacity-70">{q.type} • {q.dureeMax} min</div>
                    <div className="font-medium">{q.titre}</div>
                    <div className="text-sm opacity-80 line-clamp-2">{q.description}</div>
                  </Link>
                  {(role === 'Mentor' || role === 'Admin') ? (
                    <div className="flex gap-2">
                      <Link href={`/quizzes/${q.id}/manage`} className="btn-outline h-8 text-xs">Gérer</Link>
                      <DeleteButton url={`/api/quizzes/${q.id}`} label="Supprimer" confirmText="Supprimer ce quiz ?" />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div>
        <Link href={`/courses/${module.coursId}`} className="inline-block px-3 py-2 rounded-md border hover:bg-foreground/5">← Retour au cours</Link>
      </div>
    </main>
  );
}
