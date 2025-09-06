import { prisma } from "../db/prisma";

export async function notifyUser(userId: number, title: string, content: string) {
  return prisma.notification.create({ data: { userId, title, content } });
}

export async function listMyNotifications(userId: number) {
  return prisma.notification.findMany({ where: { userId }, orderBy: { dateCreated: "desc" } });
}

export async function markNotificationRead(userId: number, id: number) {
  await prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
}
