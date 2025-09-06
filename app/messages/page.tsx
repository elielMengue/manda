import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../lib/auth";
import { listConversations } from "../../lib/api/messages";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Messages</h1>
        <p className="opacity-80">Vous devez être connecté.</p>
        <div className="mt-4">
          <Link href="/login" className="inline-flex h-10 px-4 items-center rounded-md border border-foreground/20 hover:bg-foreground/5">Se connecter</Link>
        </div>
      </main>
    );
  }
  const token = (session as BackendFields).backendAccessToken as string;
  let items: Awaited<ReturnType<typeof listConversations>> = [];
  let error: string | null = null;
  try {
    items = await listConversations(token);
  } catch (e: unknown) {
    error = (e as { message?: string })?.message || "Erreur";
  }
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Conversations</h1>
      {error ? (
        <div className="rounded-md border border-red-500/40 p-3 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-sm opacity-70">Aucune conversation pour l&apos;instant.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li key={c.userId} className="rounded-md border border-foreground/10 p-4 hover:bg-foreground/5">
              <Link href={`/messages/${c.userId}`}>Utilisateur #{c.userId} — {c.lastMessage.content.slice(0, 60)}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
