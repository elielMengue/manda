'use client';

import { useState } from 'react';

interface DocItem { name: string; url: string; }

export default function DocumentManager() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [query, setQuery] = useState('');

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setDocs((prev) => [...prev, ...files]);
  };

  const remove = (url: string) => {
    setDocs((prev) => prev.filter((d) => d.url !== url));
  };

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="card p-4 space-y-3">
      <div className="text-sm opacity-70">Documents</div>
      <input type="file" multiple onChange={onUpload} className="block text-sm" />
      <input
        type="text"
        placeholder="Rechercher…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
      />
      <ul className="space-y-2">
        {filtered.map((d) => (
          <li key={d.url} className="flex items-center justify-between rounded-md border border-foreground/10 px-3 py-2 text-sm">
            <span className="truncate mr-2" title={d.name}>{d.name}</span>
            <span className="flex gap-2">
              <a href={d.url} download={d.name} className="text-blue-600 hover:underline">Télécharger</a>
              <button onClick={() => remove(d.url)} className="text-red-600">×</button>
            </span>
          </li>
        ))}
        {filtered.length === 0 && <li className="text-sm opacity-70">Aucun document.</li>}
      </ul>
    </div>
  );
}

