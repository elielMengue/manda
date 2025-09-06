import { getServerSession } from "next-auth";
import { authOptions, type BackendFields } from "../../../lib/auth";
import { getConversation } from "../../../lib/api/messages";
import MessageComposer from "../../../components/MessageComposer";
import Link from "next/link";

export default async function ConversationPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const otherId = Number(userId);
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Conversation</h1>
        <p className="opacity-80">Vous devez être connecté.</p>
        <div className="mt-4">
          <Link href="/api/auth/signin" className="inline-flex h-10 px-4 items-center rounded-md border border-foreground/20 hover:bg-foreground/5">Se connecter</Link>
        </div>
      </main>
    );
  }
  const token = (session as BackendFields).backendAccessToken as string;
  let items = [] as Awaited<ReturnType<typeof getConversation>>;
  let error: string | null = null;
  try {
    items = await getConversation(token, otherId);
  } catch (e: unknown) {
    error = (e as { message?: string })?.message || "Erreur";
  }
  const myId = (session as BackendFields).backendUserId as number | undefined;
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Conversation avec #{otherId}</h1>
      {error ? (
        <div className="rounded-md border border-red-500/40 p-3 text-sm">{error}</div>
      ) : (
        <div className="space-y-2">
          {items.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${m.senderId === myId ? 'self-end bg-foreground/10 ml-auto' : 'self-start border border-foreground/10'} `}>
              <div>{m.content}</div>
              <div className="text-[10px] opacity-60 mt-1">{new Date(m.dateSent).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-foreground/10">
        <MessageComposer receiverId={otherId} onSent={() => { /* rely on user refresh */ }} />
      </div>
    </main>
  );
}

