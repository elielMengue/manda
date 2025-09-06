'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BackLink({ href, label = 'Retour' }: { href?: string; label?: string }) {
  const router = useRouter();
  if (href) {
    return (
      <Link href={href} className="inline-flex items-center gap-2 text-sm btn-ghost h-8">
        <span aria-hidden>←</span> {label}
      </Link>
    );
  }
  return (
    <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm btn-ghost h-8">
      <span aria-hidden>←</span> {label}
    </button>
  );
}

