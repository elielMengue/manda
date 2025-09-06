'use client';

import { useState } from 'react';

export default function MessageComposer({ receiverId, onSent }: { receiverId: number; onSent?: () => void }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setContent('');
      onSent?.();
    } catch (e: any) {
      setError(e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={send} className="flex gap-2">
      <input
        className="flex-1 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
        placeholder="Votre message..."
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
      />
      <button disabled={loading || !content.trim()} className="btn-accent disabled:opacity-60">
        {loading ? 'Envoi…' : 'Envoyer'}
      </button>
      {error && <div className="text-sm text-red-400">{error}</div>}
    </form>
  );
}
