'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function AdminMessageForm() {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'all'|'role'|'users'|'single'>('all');
  const [role, setRole] = useState<'Admin'|'Apprenant'|'Mentor'|'Partenaire'>('Apprenant');
  const [userIds, setUserIds] = useState('');
  const [userId, setUserId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const body: Record<string, unknown> = { content };
      if (mode === 'role') body.role = role;
      if (mode === 'users') body.userIds = userIds.split(',').map((s) => Number(s.trim())).filter(Boolean);
      if (mode === 'single' && userId) body.userIds = [userId];
      const res = await fetch('/api/admin/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast(`Message envoyé (${data?.created ?? 0}) ✔️`, 'success');
      setContent('');
      setUserIds('');
      setUserId('');
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">
        <span className="opacity-80">Contenu</span>
        <input value={content} onChange={(e)=>setContent(e.currentTarget.value)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" required />
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block text-sm">
          <span className="opacity-80">Cible</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.currentTarget.value as 'all' | 'role' | 'users' | 'single')}
            className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
          >
            <option value="all">Tous</option>
            <option value="role">Par rôle</option>
            <option value="users">Par IDs</option>
            <option value="single">Un utilisateur</option>
          </select>
        </label>
        {mode === 'role' && (
          <label className="block text-sm">
            <span className="opacity-80">Rôle</span>
            <select
              value={role}
              onChange={(e) => setRole(e.currentTarget.value as 'Admin' | 'Apprenant' | 'Mentor' | 'Partenaire')}
              className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
            >
              {(['Admin', 'Apprenant', 'Mentor', 'Partenaire'] as const).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        )}
        {mode === 'users' && (
          <label className="block text-sm">
            <span className="opacity-80">User IDs (1,2,3)</span>
            <input value={userIds} onChange={(e)=>setUserIds(e.currentTarget.value)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
          </label>
        )}
        {mode === 'single' && (
          <label className="block text-sm">
            <span className="opacity-80">User ID</span>
            <input
              value={userId}
              onChange={(e) => setUserId(Number(e.currentTarget.value) || '')}
              className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
            />
          </label>
        )}
      </div>
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Envoyer'}</button>
    </form>
  );
}

