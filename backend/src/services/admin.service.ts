import { prisma } from "../db/prisma";

export async function getAdminMetricsService() {
  const [users, courses, modules, lessons, quizzes, inscriptions, posts, certificates] = await Promise.all([
    prisma.user.count(),
    prisma.cours.count(),
    prisma.module.count(),
    prisma.lesson.count(),
    prisma.quiz.count(),
    prisma.inscription.count(),
    prisma.post.count(),
    prisma.certificat.count(),
  ]);

  const [admins, mentors, apprenants, partenaires] = await Promise.all([
    prisma.user.count({ where: { role: "Admin" } as any }),
    prisma.user.count({ where: { role: "Mentor" } as any }),
    prisma.user.count({ where: { role: "Apprenant" } as any }),
    prisma.user.count({ where: { role: "Partenaire" } as any }),
  ]);

  return {
    users: { total: users, admins, mentors, apprenants, partenaires },
    contents: { courses, modules, lessons, quizzes },
    activity: { inscriptions, posts, certificates },
  };
}

export async function notifyUsersByFilterService(input: { userIds?: number[]; role?: any; title: string; content: string }) {
  const { userIds, role, title, content } = input;
  let targets: { id: number }[] = [];
  if (Array.isArray(userIds) && userIds.length > 0) {
    targets = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true } });
  } else if (role) {
    targets = await prisma.user.findMany({ where: { role } as any, select: { id: true } });
  } else {
    targets = await prisma.user.findMany({ select: { id: true } });
  }
  if (targets.length === 0) return { created: 0 };
  const created = await prisma.notification.createMany({ data: targets.map((t) => ({ userId: t.id, title, content })) });
  return { created: created.count };
}

export async function resetUserPasswordService(userId: number, newPasswordHash: string) {
  await prisma.user.update({ where: { id: userId }, data: { password: newPasswordHash } });
  return { id: userId };
}

export async function exportUsersCsvService() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true, createdAt: true },
  });
  const header = ["id","firstName","lastName","email","role","status","createdAt"].join(",");
  const rows = users.map(u => [u.id, u.firstName, u.lastName, u.email, u.role, u.status ? "true" : "false", u.createdAt.toISOString()].join(","));
  return [header, ...rows].join("\n");
}

export async function adminSendMessagesService(senderId: number, input: { content: string; userIds?: number[]; role?: any }) {
  const { content, userIds, role } = input;
  let targets: { id: number }[] = [];
  if (Array.isArray(userIds) && userIds.length > 0) {
    targets = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true } });
  } else if (role) {
    targets = await prisma.user.findMany({ where: { role } as any, select: { id: true } });
  } else {
    targets = await prisma.user.findMany({ select: { id: true } });
  }
  const rows = targets
    .map((t) => t.id)
    .filter((id) => id !== senderId)
    .map((id) => ({ senderId, receiverId: id, content }));
  if (rows.length === 0) return { created: 0 };
  const created = await (prisma as any).message.createMany({ data: rows });
  return { created: created.count ?? rows.length };
}
