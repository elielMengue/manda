'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';
import Image from 'next/image';

type MePatch = { firstName?: string; lastName?: string; address?: string; phone?: string; photoUrl?: string };

export default function ProfileEditForm({ initial }: { initial?: MePatch }) {
  const [form, setForm] = useState<MePatch>({
    firstName: initial?.firstName || '',
    lastName: initial?.lastName || '',
    address: initial?.address || '',
    phone: initial?.phone || '',
    photoUrl: initial?.photoUrl || '',
  });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof MePatch, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('/api/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json().catch(()=>null);
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Profil mis à jour ✔️', 'success');
    } catch (e: any) { toast(e?.message || 'Erreur', 'error'); } finally { setLoading(false); }
  };
  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/uploads/image', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setForm((f)=>({ ...f, photoUrl: data.url }));
      toast('Image uploadée ✔️', 'success');
    } catch (err: any) { toast(err?.message || 'Upload échoué', 'error'); }
    finally { e.currentTarget.value = ''; }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center">
          {form.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.photoUrl} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="opacity-70 text-sm">🙂</span>
          )}
        </div>
        <label className="text-sm">
          <span className="opacity-80">Uploader une image</span>
          <input type="file" accept="image/*" onChange={onAvatar} className="block mt-1 text-xs" />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Prénom" value={form.firstName} onChange={(e)=>set('firstName', e.currentTarget.value)} required />
        <Field label="Nom" value={form.lastName} onChange={(e)=>set('lastName', e.currentTarget.value)} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Adresse" value={form.address} onChange={(e)=>set('address', e.currentTarget.value)} />
        <Field label="Téléphone" value={form.phone} onChange={(e)=>set('phone', e.currentTarget.value)} />
      </div>
      <Field label="Photo URL" value={form.photoUrl} onChange={(e)=>set('photoUrl', e.currentTarget.value)} />
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Enregistrer'}</button>
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
