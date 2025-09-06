'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from '../lib/toast';

export default function CredentialsLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/dashboard' });
    setLoading(false);
    if (res?.ok) { window.location.href = res.url || '/dashboard'; }
    else { toast(res?.error || 'Identifiants invalides', 'error'); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="text-xs opacity-70">Mentors, Partenaires et Admins se connectent avec les identifiants fournis par l’Admin. Les Admins sont pré-enregistrés dans la base de données.</div>
      <label className="block text-sm">
        <span className="opacity-80">Email</span>
        <input value={email} onChange={(e)=>setEmail(e.currentTarget.value)} type="email" required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <label className="block text-sm">
        <span className="opacity-80">Mot de passe</span>
        <input value={password} onChange={(e)=>setPassword(e.currentTarget.value)} type="password" required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <div className="flex items-center gap-3">
        <button disabled={loading} className="btn-accent">{loading ? 'Connexion…' : 'Se connecter'}</button>
        <a href="/forgot-password" className="text-xs underline opacity-80">Mot de passe oublié ?</a>
      </div>
    </form>
  );
}
