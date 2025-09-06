'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function AddLessonForm({ moduleId }: { moduleId: number }) {
  const [form, setForm] = useState({ titre: '', textContenu: '', duree: 10, type: 'video', ordre: 0, videoUrl: '' });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Leçon créée ✅', 'success');
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Titre" value={form.titre} onChange={(e) => set('titre', e.currentTarget.value)} required />
      <Field label="Texte" value={form.textContenu} onChange={(e) => set('textContenu', e.currentTarget.value)} required />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Durée" type="number" value={form.duree} onChange={(e) => set('duree', Number(e.currentTarget.value))} required />
        <Field label="Type" value={form.type} onChange={(e) => set('type', e.currentTarget.value)} required />
        <Field label="Ordre" type="number" value={form.ordre} onChange={(e) => set('ordre', Number(e.currentTarget.value))} required />
      </div>
      <Field label="Video URL" value={form.videoUrl} onChange={(e) => set('videoUrl', e.currentTarget.value)} required />
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Créer la leçon'}</button>
    </form>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="opacity-80">{label}</span>
      <input {...props} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
    </label>
  );
}

