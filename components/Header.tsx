'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b border-foreground/10 bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <a href="/" className="font-semibold">EduImpact</a>

        <nav className="flex items-center gap-3 text-sm">
          <a href="/" className="opacity-80 hover:opacity-100">Accueil</a>
          <a href="/courses" className="opacity-80 hover:opacity-100">Cours</a>
          <a href="/my/courses" className="opacity-80 hover:opacity-100">Mes cours</a>
          <a href="/profile" className="opacity-80 hover:opacity-100">Profil</a>
          <a href="/notifications" className="opacity-80 hover:opacity-100">Notifications</a>
          <a href="/messages" className="opacity-80 hover:opacity-100">Messages</a>
          <a href="/certificates/issue" className="opacity-80 hover:opacity-100">Certificats</a>
          <a href="/dashboard" className="opacity-80 hover:opacity-100">Dashboard</a>

          {status === 'authenticated' ? (
            <>
              <span className="opacity-70 hidden sm:inline">
                {(session?.user?.name || session?.user?.email) ?? 'Connecté'}
              </span>
              <button
                onClick={() => signOut()}
                className="inline-flex h-8 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <a href="/login" className="inline-flex h-8 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5">Se connecter</a>
          )}
        </nav>
      </div>
    </header>
  );
}
