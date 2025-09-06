'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function AddQuizForm({ moduleId }: { moduleId: number }) {
  const [form, setForm] = useState({ titre: '', description: '', dureeMax: 15, nombreTentatives: 1, scoreMinReussite: 0, type: 'QCM' });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/modules/${moduleId}/quizzes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Quiz créé ✅', 'success');
    } catch (e: any) {
      toast(e?.message || 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Titre" value={form.titre} onChange={(e) => set('titre', e.currentTarget.value)} required />
      <Field label="Description" value={form.description} onChange={(e) => set('description', e.currentTarget.value)} required />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Durée (min)" type="number" value={form.dureeMax} onChange={(e) => set('dureeMax', Number(e.currentTarget.value))} required />
        <Field label="Tentatives" type="number" value={form.nombreTentatives} onChange={(e) => set('nombreTentatives', Number(e.currentTarget.value))} required />
        <Field label="Score min" type="number" value={form.scoreMinReussite} onChange={(e) => set('scoreMinReussite', Number(e.currentTarget.value))} required />
      </div>
      <Field label="Type" value={form.type} onChange={(e) => set('type', e.currentTarget.value)} required />
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Créer le quiz'}</button>
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

