import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import { listMyInscriptions } from "../../../lib/api/inscriptions";

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Mes cours</h1>
        <p className="opacity-80">Vous devez être connecté pour voir vos cours.</p>
        <div className="mt-4">
          <Link href="/login" className="inline-flex h-10 px-4 items-center rounded-md border border-foreground/20 hover:bg-foreground/5">Se connecter</Link>
        </div>
      </main>
    );
  }

  let items: Awaited<ReturnType<typeof listMyInscriptions>> = [];
  let error: string | null = null;
  try {
    items = await listMyInscriptions((session as BackendFields).backendAccessToken!);
  } catch (e: unknown) {
    error = (e as { message?: string })?.message || "Erreur";
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Mes cours</h1>
        <div className="text-sm opacity-70">{items.length} inscriptions</div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-500/40 p-3 text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((ins) => (
            <Link key={ins.id} href={`/courses/${ins.coursId}`} className="group rounded-lg border border-foreground/10 hover:border-foreground/20 p-4 flex flex-col">
              <div className="aspect-video rounded-md bg-foreground/10 mb-3 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ins.cours.imageUrl} alt={ins.cours.titre} className="w-full h-full object-cover" />
              </div>
              <div className="text-sm opacity-70">Progression: {ins.progression}%</div>
              <div className="text-lg font-medium leading-tight line-clamp-2">{ins.cours.titre}</div>
              <div className="text-sm opacity-80 line-clamp-2 mt-1">{ins.cours.description}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
