'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function AddModuleForm({ coursId }: { coursId: number }) {
  const [form, setForm] = useState({ titre: '', description: '', ordre: 0, duree: 60 });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${coursId}/modules`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Module créé ✅', 'success');
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Titre" value={form.titre} onChange={(e) => set('titre', e.currentTarget.value)} required />
      <Field label="Description" value={form.description} onChange={(e) => set('description', e.currentTarget.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ordre" type="number" value={form.ordre} onChange={(e) => set('ordre', Number(e.currentTarget.value))} required />
        <Field label="Durée (min)" type="number" value={form.duree} onChange={(e) => set('duree', Number(e.currentTarget.value))} required />
      </div>
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Créer le module'}</button>
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

