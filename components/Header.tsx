"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="w-full border-b border-foreground/10 bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">EduImpact</Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/courses" className="opacity-80 hover:opacity-100">Cours</Link>
          <Link href="/my/courses" className="opacity-80 hover:opacity-100">Mes cours</Link>
          <Link href="/profile" className="opacity-80 hover:opacity-100">Profil</Link>
          <Link href="/notifications" className="opacity-80 hover:opacity-100">Notifications</Link>
          <Link href="/messages" className="opacity-80 hover:opacity-100">Messages</Link>
          <Link href="/certificates/issue" className="opacity-80 hover:opacity-100">Certificats</Link>
          <Link href="/dashboard" className="opacity-80 hover:opacity-100">Dashboard</Link>

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
            <Link href="/login" className="inline-flex h-8 px-3 items-center rounded-md border border-foreground/20 hover:bg-foreground/5">Se connecter</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
