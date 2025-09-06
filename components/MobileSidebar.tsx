'use client';

import { useState } from 'react';
import SidebarNav, { type NavItem } from './SidebarNav';
import { FiMenu } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';

export default function MobileSidebar({ sections }: { sections: Array<{ title: string; items: NavItem[] }> }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  return (
    <>
      <div className="md:hidden sticky top-0 z-40 border-b border-foreground/10 bg-background/70 backdrop-blur">
        <div className="h-12 px-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md border border-foreground/20">
            <FiMenu /> Menu
          </button>
          <div className="text-sm opacity-70">EduImpact</div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-background flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-3 py-4 text-lg font-semibold">Navigation</div>
            <div className="flex-1 overflow-auto">
              <SidebarNav sections={sections} />
            </div>
            <div className="border-t border-foreground/10 p-3 text-sm">
              {session?.user ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">{session.user.name || session.user.email}</div>
                  <button onClick={() => signOut()} className="btn-outline h-8">Logout</button>
                </div>
              ) : (
                <a href="/login" className="btn-outline w-full">Login</a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
