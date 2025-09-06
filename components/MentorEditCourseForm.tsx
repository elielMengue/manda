'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function MentorEditCourseForm({ id, initial }: { id: number; initial: { titre: string; description: string; duree: number; status: string; imageUrl: string } }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Cours mis à jour ✔️', 'success');
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    } finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Titre" value={form.titre} onChange={(e)=>set('titre', e.currentTarget.value)} required />
        <Field label="Durée (min)" type="number" value={form.duree} onChange={(e)=>set('duree', Number(e.currentTarget.value))} required />
      </div>
      <Field label="Description" value={form.description} onChange={(e)=>set('description', e.currentTarget.value)} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Statut" value={form.status} onChange={(e)=>set('status', e.currentTarget.value)} required />
        <Field label="Image URL" value={form.imageUrl} onChange={(e)=>set('imageUrl', e.currentTarget.value)} required />
      </div>
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Enregistrer'}</button>
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

