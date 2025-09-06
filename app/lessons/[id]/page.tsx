import { getLesson } from "../../../lib/api/lessons";
import Link from "next/link";
import CompleteLessonButton from "../../../components/CompleteLessonButton";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lessonId = Number(id);
  const lesson = await getLesson(lessonId);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{lesson.titre}</h1>
        <div className="text-sm opacity-70">{lesson.type} • {lesson.duree} min</div>
      </div>

      {lesson.videoUrl ? (
        <div className="aspect-video bg-black/80 rounded-md overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lesson.videoUrl} alt="Video" className="w-full h-full object-cover" />
        </div>
      ) : null}

      <article className="prose prose-invert max-w-none">
        <p>{lesson.textContenu}</p>
      </article>

      <div className="pt-2">
        <Link href={`/modules/${lesson.moduleId}`} className="inline-block px-3 py-2 rounded-md border hover:bg-foreground/5">← Retour au module</Link>
      </div>

      <div className="pt-4">
        <CompleteLessonButton lessonId={lesson.id} />
      </div>
    </main>
  );
}
