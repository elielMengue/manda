'use client';

import { useEffect, useState } from 'react';
import SidebarNav, { type NavItem } from './SidebarNav';

export default function SidebarClient({ initialSections }: { initialSections: Array<{ title: string; items: NavItem[] }> }) {
  const [sections, setSections] = useState(initialSections);

  // helper to update badge by href
  const updateBadge = (href: string, badge: number) => {
    setSections((prev) => prev.map((s) => ({
      ...s,
      items: s.items.map((it) => it.href === href ? { ...it, badge } : it),
    })));
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const poll = async () => {
      try {
        const [notifsRes, convsRes] = await Promise.all([
          fetch('/api/notifications'),
          fetch('/api/messages/conversations'),
        ]);
        const notifs = notifsRes.ok ? await notifsRes.json() : [];
        const convs = convsRes.ok ? await convsRes.json() : [];
        const unread = Array.isArray(notifs) ? notifs.filter((n: { isRead?: boolean }) => !n.isRead).length : 0;
        const convCount = Array.isArray(convs) ? convs.length : 0;
        updateBadge('/notifications', unread);
        updateBadge('/messages', convCount);
      } catch {
        // ignore errors in polling
      } finally {
        timer = setTimeout(poll, 20000);
      }
    };
    poll();
    return () => { if (timer) clearTimeout(timer); };
  }, []);

  return <SidebarNav sections={sections} />;
}

