'use client';

import { useEffect, useState } from 'react';
import { toast } from '../lib/toast';

type Mentor = { id: number; userId: number; firstName: string; lastName: string; email: string };

export default function AdminCourseForm() {
  const [form, setForm] = useState({ titre: '', description: '', duree: 60, status: 'draft', imageUrl: '' });
  const [mentorId, setMentorId] = useState<number | ''>('' as any);
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    fetch('/api/admin/mentors').then(async (r) => {
      if (!r.ok) return [] as Mentor[];
      return (await r.json()) as Mentor[];
    }).then(setMentors).catch(() => setMentors([]));
  }, []);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorId) { toast('Choisissez un mentor', 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, mentorId }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Cours créé ✔️', 'success');
      setForm({ titre: '', description: '', duree: 60, status: 'draft', imageUrl: '' }); setMentorId('' as any);
    } catch (e: any) { toast(e?.message || 'Erreur', 'error'); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Titre" value={form.titre} onChange={(e) => set('titre', e.currentTarget.value)} required />
        <Field label="Durée (min)" type="number" value={form.duree} onChange={(e) => set('duree', Number(e.currentTarget.value))} required />
      </div>
      <Field label="Description" value={form.description} onChange={(e) => set('description', e.currentTarget.value)} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Statut" value={form.status} onChange={(e) => set('status', e.currentTarget.value)} required />
        <Field label="Image URL" value={form.imageUrl} onChange={(e) => set('imageUrl', e.currentTarget.value)} required />
      </div>

      <label className="block text-sm">
        <span className="opacity-80">Mentor</span>
        <select value={mentorId} onChange={(e)=>setMentorId(Number(e.currentTarget.value)||'' as any)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" required>
          <option value="">Choisir…</option>
          {mentors.map((m) => (
            <option key={m.id} value={m.id}>{m.firstName} {m.lastName} — {m.email}</option>
          ))}
        </select>
      </label>

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

