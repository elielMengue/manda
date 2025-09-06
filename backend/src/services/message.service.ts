import { prisma } from "../db/prisma";
import { HttpError } from "../middlewares/error";

export async function sendMessageService(senderId: number, receiverId: number, content: string) {
  if (senderId === receiverId) throw new HttpError(400, "Impossible de s'envoyer un message à soi-même");
  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: senderId } }),
    prisma.user.findUnique({ where: { id: receiverId } }),
  ]);
  if (!sender || !receiver) throw new HttpError(404, "Utilisateur introuvable");
  const msg = await prisma.message.create({ data: { senderId, receiverId, content } });
  return { id: msg.id };
}

export async function listConversationsService(userId: number) {
  // liste des derniers messages par interlocuteur
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { dateSent: "desc" },
    take: 200,
  });
  const map = new Map<number, typeof messages[number]>();
  for (const m of messages) {
    const other = m.senderId === userId ? m.receiverId : m.senderId;
    if (!map.has(other)) map.set(other, m);
  }
  return [...map.entries()].map(([user, msg]) => ({ userId: user, lastMessage: msg }));
}

export async function getConversationService(userId: number, otherId: number) {
  const other = await prisma.user.findUnique({ where: { id: otherId } });
  if (!other) throw new HttpError(404, "Interlocuteur introuvable");
  const items = await prisma.message.findMany({
    where: { OR: [ { senderId: userId, receiverId: otherId }, { senderId: otherId, receiverId: userId } ] },
    orderBy: { dateSent: "asc" },
    take: 500,
  });
  return items;
}

