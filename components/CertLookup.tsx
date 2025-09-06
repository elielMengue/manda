'use client';

import { useState } from 'react';

export default function CertLookup({ base }: { base: string }) {
  const [id, setId] = useState('');
  const href = id ? `${base}/api/v1/certificats/${id}/pdf` : '#';
  return (
    <div className="rounded-md border border-foreground/15 p-4 flex items-end gap-3 max-w-md">
      <label className="flex-1 text-sm">
        <span className="opacity-80">Identifiant du certificat</span>
        <input value={id} onChange={(e) => setId(e.currentTarget.value)} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" placeholder="ex: 42" />
      </label>
      <a href={href} target="_blank" rel="noreferrer" className={`inline-flex h-10 px-4 items-center rounded-md border ${id ? 'hover:bg-foreground/5' : 'opacity-50 pointer-events-none'}`}>Télécharger PDF</a>
    </div>
  );
}

