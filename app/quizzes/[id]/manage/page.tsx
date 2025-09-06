import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { getQuizFull } from "../../../../lib/api/quizzes";
import { useState } from 'react';
import { toast } from "../../../../lib/toast";

export default async function ManageQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quizId = Number(id);
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session as BackendFields).backendRole as string | undefined;
  if (role !== 'Mentor' && role !== 'Admin') redirect(`/quizzes/${quizId}`);

  const token = (session as BackendFields).backendAccessToken as string;
  const quiz = await getQuizFull(quizId, token).catch(() => null);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Gérer le quiz: {quiz?.titre || quizId}</h1>
      <section className="rounded-md border border-foreground/15 p-4">
        <div className="text-sm opacity-70 mb-2">Ajouter une question</div>
        <AddQuestionForm quizId={quizId} />
      </section>

      <section className="space-y-3">
        <div className="text-sm opacity-70">Questions</div>
        {(quiz?.questions || []).map((q: Question) => (
          <div key={q.id} className="rounded-md border border-foreground/10 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium">{q.ordre + 1}. {q.questionText} ({q.typeQuestion})</div>
              <form action={`/api/questions/${q.id}`} method="post" className="contents">
                <button formMethod="DELETE" className="btn-outline h-8 text-xs">Supprimer</button>
              </form>
            </div>
            {String(q.typeQuestion).toLowerCase().includes('qcm') ? (
              <div className="space-y-2">
                {(q.options || []).map((o: Option) => (
                  <div key={o.id} className="flex items-center justify-between gap-2 text-sm">
                    <div>{o.optionText} {o.isCorrect ? '• Correcte' : ''}</div>
                    <form action={`/api/options/${o.id}`} method="post" className="contents">
                      <button formMethod="DELETE" className="btn-outline h-7 text-xs">Supprimer</button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(q.reponses || []).map((r: Answer) => (
                  <div key={r.id} className="flex items-center justify-between gap-2 text-sm">
                    <div>{r.reponseText}</div>
                    <form action={`/api/reponses/${r.id}`} method="post" className="contents">
                      <button formMethod="DELETE" className="btn-outline h-7 text-xs">Supprimer</button>
                    </form>
                  </div>
                ))}
              </div>
            )}
            <AddOptionOrAnswer question={q} />
          </div>
        ))}
      </section>
    </main>
  );
}

function AddQuestionForm({ quizId }: { quizId: number }) {
  const [form, setForm] = useState({ questionText: '', ordre: 0, points: 1, typeQuestion: 'QCM' });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}/questions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Question ajoutée ✅', 'success');
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    } finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
      <Field label="Texte" value={form.questionText} onChange={(e) => set('questionText', e.currentTarget.value)} required className="sm:col-span-2" />
      <Field label="Ordre" type="number" value={form.ordre} onChange={(e) => set('ordre', Number(e.currentTarget.value))} required />
      <Field label="Points" type="number" value={form.points} onChange={(e) => set('points', Number(e.currentTarget.value))} required />
      <Field label="Type" value={form.typeQuestion} onChange={(e) => set('typeQuestion', e.currentTarget.value)} required />
      <button disabled={loading} className="btn-accent disabled:opacity-60 sm:col-span-4">{loading ? 'En cours…' : 'Ajouter'}</button>
    </form>
  );
}

interface Option { id: number; optionText: string; isCorrect?: boolean; }
interface Answer { id: number; reponseText: string; }
interface Question { id: number; ordre: number; questionText: string; typeQuestion: string; options?: Option[]; reponses?: Answer[]; }

function AddOptionOrAnswer({ question }: { question: Question }) {
  const isQcm = question.typeQuestion.toLowerCase().includes('qcm');
  return isQcm ? <AddOptionForm questionId={question.id} /> : <AddAnswerForm questionId={question.id} />;
}

function AddOptionForm({ questionId }: { questionId: number }) {
  const [form, setForm] = useState({ optionText: '', isCorrect: false });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/options`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Option ajoutée ✅', 'success');
      setForm({ optionText: '', isCorrect: false });
    } catch (e: unknown) { toast((e as { message?: string })?.message || 'Erreur', 'error'); } finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <Field label="Option" value={form.optionText} onChange={(e) => setForm((f) => ({ ...f, optionText: e.currentTarget.value }))} required />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isCorrect} onChange={(e) => setForm((f) => ({ ...f, isCorrect: e.currentTarget.checked }))} /> Correcte</label>
      <button disabled={loading} className="btn-outline">Ajouter</button>
    </form>
  );
}

function AddAnswerForm({ questionId }: { questionId: number }) {
  const [reponseText, setReponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/reponses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reponseText, isCorrect: true }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Réponse ajoutée ✅', 'success');
      setReponseText('');
    } catch (e: unknown) { toast((e as { message?: string })?.message || 'Erreur', 'error'); } finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <Field label="Réponse" value={reponseText} onChange={(e) => setReponseText(e.currentTarget.value)} required />
      <button disabled={loading} className="btn-outline">Ajouter</button>
    </form>
  );
}

function Field({ label, className, ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block text-sm ${className ?? ''}`}>
      <span className="opacity-80">{label}</span>
      <input {...props} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
    </label>
  );
}
