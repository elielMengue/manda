'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { toast } from '../lib/toast';

export default function EnrollButton({ coursId }: { coursId: number }) {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (status !== 'authenticated') {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coursId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Inscription réussie ✅', 'success');
    } catch (e: any) {
      toast(e?.message || "Échec de l'inscription", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        disabled={loading}
        onClick={handleClick}
        className="btn-accent disabled:opacity-60"
      >
        {loading ? 'En cours…' : 'S\'inscrire au cours'}
      </button>
    </div>
  );
}
