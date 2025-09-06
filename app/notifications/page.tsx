import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { listMyNotifications } from "../../lib/api/notifications";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <p className="opacity-80">Vous devez être connecté.</p>
        <div className="mt-4">
          <a href="/login" className="inline-flex h-10 px-4 items-center rounded-md border border-foreground/20 hover:bg-foreground/5">Se connecter</a>
        </div>
      </main>
    );
  }

  const token = (session as any).backendAccessToken as string;
  let items: Awaited<ReturnType<typeof listMyNotifications>> = [];
  let error: string | null = null;
  try {
    items = await listMyNotifications(token);
  } catch (e: any) {
    error = e?.message || "Erreur";
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      {error ? (
        <div className="rounded-md border border-red-500/40 p-3 text-sm">{error}</div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id} className={`rounded-md border p-4 ${n.isRead ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm opacity-80">{n.content}</div>
                  <div className="text-xs opacity-60 mt-1">{new Date(n.dateCreated).toLocaleString()}</div>
                </div>
                {!n.isRead && <MarkReadButton id={n.id} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function MarkReadButton({ id }: { id: number }) {
  return (
    <form action={`/api/notifications/${id}/read`} method="post" className="contents">
      <button
        formMethod="PATCH"
        className="btn-outline h-8 text-sm"
      >
        Marquer comme lu
      </button>
    </form>
  );
}
