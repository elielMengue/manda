export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Réinitialiser le mot de passe</h1>
      <p className="text-sm opacity-80">Collez le token reçu par email et définissez un nouveau mot de passe.</p>
      <ResetForm />
    </main>
  );
}

'use client';
import { useState } from 'react';
import { toast } from '../../lib/toast';
import { useRouter } from 'next/navigation';

function ResetForm() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/auth/password/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Mot de passe réinitialisé ✅', 'success');
      router.push('/login');
    } catch (e: any) { toast(e?.message || 'Erreur', 'error'); } finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">
        <span className="opacity-80">Token</span>
        <input value={token} onChange={(e)=>setToken(e.currentTarget.value)} required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <label className="block text-sm">
        <span className="opacity-80">Nouveau mot de passe</span>
        <input type="password" value={password} onChange={(e)=>setPassword(e.currentTarget.value)} required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <button disabled={loading} className="btn-accent">{loading ? 'En cours…' : 'Réinitialiser'}</button>
    </form>
  );
}

