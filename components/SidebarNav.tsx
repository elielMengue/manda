'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { FiHome, FiBookOpen, FiUser, FiBell, FiMessageSquare, FiAward, FiGrid, FiBriefcase } from 'react-icons/fi';

const ICONS: Record<string, IconType> = {
  home: FiHome,
  book: FiBookOpen,
  user: FiUser,
  bell: FiBell,
  message: FiMessageSquare,
  award: FiAward,
  grid: FiGrid,
  briefcase: FiBriefcase,
};

export type NavItem = { href: string; label: string; icon?: keyof typeof ICONS; badge?: number };

export default function SidebarNav({ sections }: { sections: Array<{ title: string; items: NavItem[] }> }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  return (
    <div className="px-2 py-2 space-y-6">
      {sections.map((s) => (
        <div key={s.title} className="space-y-1">
          <div className="text-xs uppercase tracking-wide opacity-60 px-3">{s.title}</div>
          <nav className="space-y-1">
            {s.items.map((it) => {
              const Icon = it.icon ? ICONS[it.icon] : undefined;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm hover:bg-foreground/5 ${
                    isActive(it.href) ? 'bg-foreground/10' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {Icon ? <Icon className="text-base opacity-80" /> : null}
                    <span>{it.label}</span>
                  </span>
                  {typeof it.badge === 'number' && it.badge > 0 ? (
                    <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-foreground/20 text-[10px] px-1">
                      {it.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}
