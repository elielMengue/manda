'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function AdminNotifyForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'all'|'role'|'users'>('all');
  const [role, setRole] = useState<'Admin'|'Apprenant'|'Mentor'|'Partenaire'>('Apprenant');
  const [userIds, setUserIds] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = { title, content };
      if (mode === 'role') body.role = role;
      if (mode === 'users') body.userIds = userIds.split(',').map(s => Number(s.trim())).filter(Boolean);
      const res = await fetch('/api/admin/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast(`Notification envoyée (${data?.created ?? 0}) ✔️`, 'success');
      setTitle(''); setContent(''); setUserIds('');
    } catch (e: any) { toast(e?.message || 'Erreur', 'error'); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Titre" value={title} onChange={(e) => setTitle(e.currentTarget.value)} required />
        <label className="block text-sm">
          <span className="opacity-80">Cible</span>
          <select value={mode} onChange={(e)=>setMode(e.currentTarget.value as any)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm">
            <option value="all">Tous</option>
            <option value="role">Par rôle</option>
            <option value="users">Par IDs</option>
          </select>
        </label>
      </div>
      {mode === 'role' && (
        <label className="block text-sm">
          <span className="opacity-80">Rôle</span>
          <select value={role} onChange={(e)=>setRole(e.currentTarget.value as any)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm">
            {(['Admin','Apprenant','Mentor','Partenaire'] as const).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      )}
      {mode === 'users' && (
        <Field label="User IDs (séparés par des virgules)" value={userIds} onChange={(e)=>setUserIds(e.currentTarget.value)} placeholder="1,2,3" />
      )}
      <Field label="Contenu" value={content} onChange={(e) => setContent(e.currentTarget.value)} required />
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Envoyer'}</button>
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

