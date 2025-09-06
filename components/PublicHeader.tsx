import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold">EduImpact</Link>
        <nav className="hidden md:flex items-center gap-3 text-sm">
          <Link href="/signup" className="btn-accent">Get started</Link>
          <Link href="/login" className="btn-outline">Login</Link>
        </nav>
        <div className="md:hidden"><Link href="/login" className="btn-outline">Login</Link></div>
      </div>
    </header>
  );
}
