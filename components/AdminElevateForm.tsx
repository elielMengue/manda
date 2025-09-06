'use client';

import { useState } from 'react';
import { toast } from "../lib/toast";

export default function AdminElevateForm({ email }: { email?: string }) {
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/admin/elevate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) });
      if (!res.ok) { const data = await res.json().catch(()=>null); throw new Error(data?.error || `HTTP ${res.status}`); }
      window.location.href = '/admin';
    } catch (e: unknown) { toast((e as { message?: string })?.message || 'Erreur', 'error'); } finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">
        <span className="opacity-80">Email</span>
        <input value={email || ''} disabled className="mt-1 w-full rounded-md border border-foreground/20 bg-foreground/5 px-3 py-2 text-sm" />
      </label>
      <label className="block text-sm">
        <span className="opacity-80">Mot de passe</span>
        <input type="password" value={pwd} onChange={(e)=>setPwd(e.currentTarget.value)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" required />
      </label>
      <button disabled={loading} className="btn-accent">{loading ? 'Vérification…' : 'Accéder au dashboard'}</button>
    </form>
  );
}

