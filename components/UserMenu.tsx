'use client';

import { signOut } from 'next-auth/react';

export default function UserMenu({ name, email, image }: { name?: string | null; email?: string | null; image?: string | null }) {
  const display = name || email || 'Connecté';
  return (
    <div className="mt-auto px-3 py-3 border-t border-foreground/10">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs opacity-70">{(display || '?').slice(0,1)}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{display}</div>
          {email ? <div className="text-xs opacity-70 truncate">{email}</div> : null}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <a href="/profile" className="inline-flex h-8 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-xs">Mon profil</a>
        <button onClick={() => signOut()} className="inline-flex h-8 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5 text-xs">Se déconnecter</button>
      </div>
    </div>
  );
}

