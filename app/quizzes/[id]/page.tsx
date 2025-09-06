import Link from "next/link";
import { getQuiz } from "../../../lib/api/quizzes";
import QuizAttemptForm from "../../../components/QuizAttemptForm";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quizId = Number(id);
  const quiz = await getQuiz(quizId);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{quiz.titre}</h1>
        <div className="text-sm opacity-70">
          {quiz.description} • Durée max {quiz.dureeMax} min • Tentatives {quiz.nombreTentatives}
        </div>
        <div className="text-sm opacity-70">Score minimum de réussite: {quiz.scoreMinReussite}</div>
      </div>

      <QuizAttemptForm quiz={quiz} />

      <div>
        <Link href={`/modules/${quiz.moduleId}`} className="inline-block px-3 py-2 rounded-md border hover:bg-foreground/5">← Retour au module</Link>
      </div>
    </main>
  );
}

