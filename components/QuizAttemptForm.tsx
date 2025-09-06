'use client';

import { useState } from 'react';
import type { Quiz, QuizQuestion } from '../lib/api/quizzes';
import { toast } from '../lib/toast';

export default function QuizAttemptForm({ quiz }: { quiz: Quiz }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ attemptId: number; score: number } | null>(null);
  const [answers, setAnswers] = useState<Record<number, { optionIds?: number[]; reponseText?: string }>>({});

  const isQcm = (q: QuizQuestion) => q.typeQuestion.toLowerCase().includes('qcm');

  const toggleOption = (qid: number, oid: number) => {
    setAnswers((prev) => {
      const current = prev[qid]?.optionIds || [];
      const exists = current.includes(oid);
      const next = exists ? current.filter((x) => x !== oid) : [...current, oid];
      return { ...prev, [qid]: { optionIds: next } };
    });
  };

  const setText = (qid: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: { reponseText: text } }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const payload = Object.entries(answers).map(([qid, value]) => ({
        questionId: Number(qid),
        ...(value.optionIds ? { optionIds: value.optionIds } : {}),
        ...(value.reponseText ? { reponseText: value.reponseText } : {}),
      }));
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setResult(data);
      toast(`Quiz soumis • Score: ${data.score}`, 'success');
    } catch (err: any) {
      setError(err?.message || 'Erreur');
      toast(err?.message || 'Erreur', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {quiz.questions.sort((a, b) => a.ordre - b.ordre).map((q) => (
        <div key={q.id} className="rounded-md border border-foreground/10 p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">{q.ordre + 1}. {q.questionText}</div>
            <div className="text-xs opacity-70">{q.points ?? 1} pt</div>
          </div>
          {isQcm(q) ? (
            <div className="mt-3 space-y-2">
              {q.options.map((o) => {
                const selected = (answers[q.id]?.optionIds || []).includes(o.id);
                return (
                  <label key={o.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleOption(q.id, o.id)}
                    />
                    <span>{o.optionText}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="mt-3">
              <input
                type="text"
                className="w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
                placeholder="Votre réponse"
                value={answers[q.id]?.reponseText || ''}
                onChange={(e) => setText(q.id, e.target.value)}
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn-accent disabled:opacity-60"
        >
          {submitting ? 'Envoi…' : 'Soumettre le quiz'}
        </button>
        {error && <div className="text-sm text-red-400">{error}</div>}
        {result && (
          <div className="text-sm opacity-80">Score: {result.score}</div>
        )}
      </div>
    </form>
  );
}
