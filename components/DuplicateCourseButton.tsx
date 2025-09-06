'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';
import { useRouter } from 'next/navigation';

export default function DuplicateCourseButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Cours dupliqué ✔️', 'success');
      router.refresh();
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    } finally { setLoading(false); }
  };
  return <button onClick={onClick} disabled={loading} className="btn-ghost h-8 text-xs">{loading? '…' : 'Dupliquer'}</button>;
}

