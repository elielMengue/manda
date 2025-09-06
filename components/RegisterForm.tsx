'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function RegisterForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', address: '', phone: '', photoUrl: '' });
  const [loading, setLoading] = useState(false);
  const onChange = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Compte créé. Continuez avec Google pour vous connecter.', 'success');
    } catch (e: any) {
      toast(e?.message || 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" placeholder="Jean" value={form.firstName} onChange={(e) => onChange('firstName', e.currentTarget.value)} required />
        <Field label="Nom" placeholder="Dupont" value={form.lastName} onChange={(e) => onChange('lastName', e.currentTarget.value)} required />
      </div>
      <Field label="Email" type="email" placeholder="jean.dupont@email.com" value={form.email} onChange={(e) => onChange('email', e.currentTarget.value)} required />
      <div>
        <Field label="Mot de passe" type="password" placeholder="Minimum 6 caractères" value={form.password} onChange={(e) => onChange('password', e.currentTarget.value)} required />
        <p className="text-xs opacity-70 mt-1">Astuce: utilisez au moins 6 caractères, avec chiffres et lettres.</p>
      </div>
      <Field label="Adresse" placeholder="Adresse complète" value={form.address} onChange={(e) => onChange('address', e.currentTarget.value)} required />
      <Field label="Téléphone" placeholder="06 00 00 00 00" value={form.phone} onChange={(e) => onChange('phone', e.currentTarget.value)} required />
      <Field label="Photo URL" placeholder="https://..." value={form.photoUrl} onChange={(e) => onChange('photoUrl', e.currentTarget.value)} required />
      <button disabled={loading} className="btn-accent">{loading ? 'En cours…' : 'Créer le compte'}</button>
      <p className="text-xs opacity-70">En créant un compte, vous acceptez nos conditions d’utilisation.</p>
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

