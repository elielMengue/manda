export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Mot de passe oublié</h1>
      <p className="text-sm opacity-80">Entrez votre email. Vous recevrez un lien/token de réinitialisation.</p>
      <ForgotForm />
    </main>
  );
}

'use client';
import { useState } from 'react';
import { toast } from '../../lib/toast';

function ForgotForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/auth/password/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Email envoyé (vérifiez votre boîte) ✅', 'success');
    } catch (e: any) { toast(e?.message || 'Erreur', 'error'); } finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">
        <span className="opacity-80">Email</span>
        <input type="email" value={email} onChange={(e)=>setEmail(e.currentTarget.value)} required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <button disabled={loading} className="btn-accent">{loading ? 'Envoi…' : 'Envoyer le lien'}</button>
    </form>
  );
}

