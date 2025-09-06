'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function MentorNav() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const view = sp.get('view') || 'published';
  const item = (href: string, label: string) => (
    <Link href={href} className={`btn-ghost h-8 text-xs ${pathname === href ? 'bg-foreground/10' : ''}`}>{label}</Link>
  );
  const viewLink = (v: string, label: string) => (
    <Link href={`/mentor?view=${v}`} className={`btn-outline h-8 text-xs ${view===v?'bg-foreground/10':''}`}>{label}</Link>
  );
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {item('/mentor', 'Dashboard mentor')}
      {item('/mentor/profile', 'Profil')}
      {item('/messages', 'Messages')}
      {item('/notifications', 'Notifications')}
      <div className="mx-2 text-xs opacity-60">Afficher:</div>
      {viewLink('published', 'Publiés')}
      {viewLink('drafts', 'Brouillons')}
      {viewLink('all', 'Tous')}
    </div>
  );
}

