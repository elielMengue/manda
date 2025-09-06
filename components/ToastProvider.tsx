'use client';

import { useEffect, useState } from 'react';

type Toast = { id: number; message: string; type?: 'success' | 'error' | 'info' };

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message: string; type?: Toast['type'] };
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message: detail.message, type: detail.type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
    window.addEventListener('toast', handler as EventListener);
    return () => window.removeEventListener('toast', handler as EventListener);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[200px] rounded-md px-3 py-2 text-sm shadow-md border ${
            t.type === 'success' ? 'bg-green-500/10 border-green-500/30' : t.type === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-foreground/10 border-foreground/20'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

