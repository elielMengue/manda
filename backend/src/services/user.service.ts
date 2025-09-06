import { prisma } from "../db/prisma";
import { HttpError } from "../middlewares/error";
import type { UpdateUserInput } from "../validators/user.schema";

export async function listUsersService(skip: number, take: number) {
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true, createdAt: true },
    }),
    prisma.user.count(),
  ]);
  return { items, total };
}

export async function getUserService(id: number) {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true, createdAt: true } });
  if (!user) throw new HttpError(404, "Utilisateur introuvable");
  return user;
}

export async function updateUserService(id: number, data: UpdateUserInput) {
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Utilisateur introuvable");
  const updated = await prisma.user.update({ where: { id }, data });
  return { id: updated.id };
}

