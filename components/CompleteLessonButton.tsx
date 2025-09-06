'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { toast } from '../lib/toast';

export default function CompleteLessonButton({ lessonId }: { lessonId: number }) {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [progression, setProgression] = useState<number | null>(null);

  const onComplete = async () => {
    if (status !== 'authenticated') {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setProgression(typeof data?.progression === 'number' ? data.progression : null);
      toast('Leçon marquée comme complétée ✅', 'success');
    } catch (e: any) {
      toast(e?.message || 'Erreur lors de la complétion', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        disabled={loading}
        onClick={onComplete}
        className="btn-outline disabled:opacity-60"
      >
        {loading ? 'En cours…' : 'Marquer comme complétée'}
      </button>
      {progression !== null && (
        <div className="text-sm opacity-80">Progression du cours: {progression}%</div>
      )}
    </div>
  );
}
