import Link from "next/link";
import { listCours } from "../../lib/api/courses";

export const dynamic = "force-dynamic";

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ page?: string; pageSize?: string }> }) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1) || 1;
  const pageSize = Number(sp.pageSize ?? 12) || 12;
  const data = await listCours({ page, pageSize });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Cours</h1>
        <div className="text-sm opacity-70">{data.total} cours</div>
      </div>

      <div key={page} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-page-enter">
        {data.items.map((c) => (
          <Link key={c.id} href={`/courses/${c.id}`} className="group rounded-lg border border-foreground/10 hover:border-foreground/20 p-4 flex flex-col transition-colors">
            <div className="aspect-video rounded-md bg-foreground/10 mb-3 overflow-hidden">
              {/* placeholder image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.imageUrl} alt={c.titre} className="w-full h-full object-cover" />
            </div>
            <div className="text-sm opacity-70">{c.status}</div>
            <div className="text-lg font-medium leading-tight line-clamp-2">{c.titre}</div>
            <div className="text-sm opacity-80 line-clamp-2 mt-1">{c.description}</div>
            <div className="mt-auto pt-3 text-xs opacity-60">{c.duree} min</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <Link
          href={`/courses?page=${Math.max(1, page - 1)}&pageSize=${pageSize}`}
          className={`px-3 py-2 rounded-md border transition-colors ${page <= 1 ? "opacity-50 pointer-events-none" : "hover:bg-foreground/5"}`}
        >
          Précédent
        </Link>
        <span className="text-sm opacity-70">Page {page}</span>
        <Link
          href={`/courses?page=${page + 1}&pageSize=${pageSize}`}
          className={`px-3 py-2 rounded-md border transition-colors ${data.items.length < pageSize ? "opacity-50 pointer-events-none" : "hover:bg-foreground/5"}`}
        >
          Suivant
        </Link>
      </div>
    </main>
  );
}

