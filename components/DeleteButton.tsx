'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '../lib/toast';

export default function DeleteButton({ url, label = 'Supprimer', confirmText }: { url: string; label?: string; confirmText?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    if (confirmText && !window.confirm(confirmText)) return;
    setLoading(true);
    try {
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json().catch(()=>null);
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Supprimé ✅', 'success');
      router.refresh();
    } catch (e: unknown) { toast((e as { message?: string })?.message || 'Erreur', 'error'); }
    finally { setLoading(false); }
  };
  return (
    <button onClick={onClick} disabled={loading} className="btn-outline h-8 text-xs">{loading ? '…' : label}</button>
  );
}

