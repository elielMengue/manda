'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function MentorCourseForm() {
  const [form, setForm] = useState({ titre: '', description: '', duree: 60, status: 'draft', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const onChange = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Cours créé ✅', 'success');
    } catch (e: any) {
      toast(e?.message || 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Titre" value={form.titre} onChange={(e) => onChange('titre', e.currentTarget.value)} required />
      <Field label="Description" value={form.description} onChange={(e) => onChange('description', e.currentTarget.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Durée (min)" type="number" value={form.duree} onChange={(e) => onChange('duree', Number(e.currentTarget.value))} required />
        <Field label="Statut" value={form.status} onChange={(e) => onChange('status', e.currentTarget.value)} required />
      </div>
      <Field label="Image URL" value={form.imageUrl} onChange={(e) => onChange('imageUrl', e.currentTarget.value)} required />
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Créer le cours'}</button>
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
