'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

function randPwd(len = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@$%*?';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function AdminInviteForm() {
  const [role, setRole] = useState<'Mentor' | 'Partenaire'>('Mentor');
  const [pwd, setPwd] = useState<string>(randPwd());
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', address: '', phone: '', photoUrl: '' });
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState<{ email: string; password: string } | null>(null);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setIssued(null);
    try {
      const res = await fetch('/api/admin/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, password: pwd, role }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Compte créé et rôle attribué ✅', 'success');
      setIssued({ email: form.email, password: pwd });
    } catch (e: any) { toast(e?.message || 'Erreur', 'error'); }
    finally { setLoading(false); }
  };

  const regen = () => setPwd(randPwd());

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2 text-sm">
        <label className={`px-3 py-2 rounded-md border ${role==='Mentor'?'bg-foreground/10':''}`}><input type="radio" className="mr-2" checked={role==='Mentor'} onChange={() => setRole('Mentor')} />Mentor</label>
        <label className={`px-3 py-2 rounded-md border ${role==='Partenaire'?'bg-foreground/10':''}`}><input type="radio" className="mr-2" checked={role==='Partenaire'} onChange={() => setRole('Partenaire')} />Partenaire</label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" value={form.firstName} onChange={(e) => set('firstName', e.currentTarget.value)} required />
        <Field label="Nom" value={form.lastName} onChange={(e) => set('lastName', e.currentTarget.value)} required />
      </div>
      <Field label="Email" type="email" value={form.email} onChange={(e) => set('email', e.currentTarget.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Adresse" value={form.address} onChange={(e) => set('address', e.currentTarget.value)} required />
        <Field label="Téléphone" value={form.phone} onChange={(e) => set('phone', e.currentTarget.value)} required />
      </div>
      <Field label="Photo URL" value={form.photoUrl} onChange={(e) => set('photoUrl', e.currentTarget.value)} required />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Mot de passe initial" value={pwd} onChange={(e) => setPwd(e.currentTarget.value)} required />
        <button type="button" onClick={regen} className="btn-outline">Générer</button>
        <div className="text-xs opacity-70 self-center">Communiquez ces identifiants à l’invité.</div>
      </div>
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Créer le compte'}</button>

      {issued && (
        <div className="mt-3 rounded-md border border-foreground/15 p-3 text-sm">
          <div className="opacity-70">Identifiants à transmettre:</div>
          <div>Email: <code>{issued.email}</code></div>
          <div>Mot de passe: <code>{issued.password}</code></div>
        </div>
      )}
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

