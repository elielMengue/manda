'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';

interface Item { id: number | string; label: string; href?: string; meta?: string; }

export default function SearchList({ items }: { items: Item[] }) {
  const [q, setQ] = useState('');
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-3">
      <SearchBar value={q} onChange={setQ} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((i) => (
          i.href ? (
            <Link key={i.id} href={i.href} className="card p-4 hover:bg-foreground/5 transition-colors">
              <div className="font-medium line-clamp-2">{i.label}</div>
              {i.meta && <div className="text-sm opacity-80 mt-1">{i.meta}</div>}
            </Link>
          ) : (
            <div key={i.id} className="card p-4">
              <div className="font-medium line-clamp-2">{i.label}</div>
              {i.meta && <div className="text-sm opacity-80 mt-1">{i.meta}</div>}
            </div>
          )
        ))}
        {filtered.length === 0 && <div className="text-sm opacity-70">Aucun résultat</div>}
      </div>
    </div>
  );
}
