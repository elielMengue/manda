'use client';

import { useState } from 'react';

export default function CertificateIssueForm() {
  const [apprenantUserId, setApprenantUserId] = useState('');
  const [coursId, setCoursId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [certId, setCertId] = useState<number | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setCertId(null);
    try {
      const res = await fetch('/api/certificats/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apprenantUserId: Number(apprenantUserId), coursId: Number(coursId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setMessage('Certificat émis ✅');
      setCertId(data.id);
    } catch (e: any) {
      setMessage(e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">
        <span className="opacity-80">User ID apprenant</span>
        <input value={apprenantUserId} onChange={(e) => setApprenantUserId(e.currentTarget.value)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" required />
      </label>
      <label className="block text-sm">
        <span className="opacity-80">Cours ID</span>
        <input value={coursId} onChange={(e) => setCoursId(e.currentTarget.value)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" required />
      </label>
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Émettre'}</button>
      {message && <div className="text-sm opacity-80">{message}</div>}
      {certId !== null && (
        <div className="text-sm">
          Certificat #{certId} • <a className="underline" href={`${base}/api/v1/certificats/${certId}/pdf`} target="_blank" rel="noreferrer">Télécharger le PDF</a>
        </div>
      )}
    </form>
  );
}
