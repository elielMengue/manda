'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export default function PartnerPostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [typeOportunite, setTypeOportunite] = useState('Offre');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, dateExpiration, imageUrl, typeOportunite, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Publication créée ✅', 'success');
      setMessage('Publication créée ✅');
      setTitle(''); setContent(''); setDateExpiration(''); setImageUrl(''); setTypeOportunite('Offre'); setStatus('active');
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
      setMessage((e as { message?: string })?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="text-sm">
        <span className="opacity-80">Titre</span>
        <input value={title} onChange={(e) => setTitle(e.currentTarget.value)} required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <label className="text-sm">
        <span className="opacity-80">Expiration</span>
        <input type="date" value={dateExpiration} onChange={(e) => setDateExpiration(e.currentTarget.value)} required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="opacity-80">Contenu</span>
        <textarea value={content} onChange={(e) => setContent(e.currentTarget.value)} required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm min-h-[100px]" />
      </label>
      <label className="text-sm">
        <span className="opacity-80">Image URL (optionnel)</span>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.currentTarget.value)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <label className="text-sm">
        <span className="opacity-80">Type</span>
        <input value={typeOportunite} onChange={(e) => setTypeOportunite(e.currentTarget.value)} required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <label className="text-sm">
        <span className="opacity-80">Statut</span>
        <input value={status} onChange={(e) => setStatus(e.currentTarget.value)} required className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
      </label>
      <div className="sm:col-span-2 flex items-center gap-2">
        <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Publier'}</button>
        {message && <div className="text-sm opacity-80">{message}</div>}
      </div>
    </form>
  );
}
