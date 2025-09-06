import { prisma } from "../db/prisma";
import type { CreateCoursInput, UpdateCoursInput } from "../validators/cours.schema";
import { HttpError } from "../middlewares/error";

export async function listCoursService(skip: number, take: number) {
  const [items, total] = await Promise.all([
    prisma.cours.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { mentor: { select: { id: true, userId: true } }, modules: true },
    }),
    prisma.cours.count(),
  ]);
  return { items, total };
}

export async function getCoursService(id: number) {
  const item = await prisma.cours.findUnique({
    where: { id },
    include: { mentor: { select: { id: true, userId: true } }, modules: true },
  });
  if (!item) throw new HttpError(404, "Cours introuvable");
  return item;
}

export async function createCoursService(input: CreateCoursInput, user: { id: number; role: string }) {
  let mentorId = input.mentorId;

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor) throw new HttpError(400, "Profil mentor introuvable");
    mentorId = mentor.id;
  } else if (user.role === "Admin") {
    if (!mentorId) throw new HttpError(400, "mentorId requis pour créer un cours");
    const exists = await prisma.mentor.findUnique({ where: { id: mentorId } });
    if (!exists) throw new HttpError(400, "mentorId invalide");
  } else {
    throw new HttpError(403, "Seuls Admin/Mentor peuvent créer des cours");
  }

  const created = await prisma.cours.create({ data: { ...input, mentorId } });
  return created;
}

export async function updateCoursService(id: number, input: UpdateCoursInput, user: { id: number; role: string }) {
  const existing = await prisma.cours.findUnique({ where: { id }, include: { mentor: true } });
  if (!existing) throw new HttpError(404, "Cours introuvable");

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== existing.mentorId) throw new HttpError(403, "Vous ne pouvez modifier que vos cours");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  const updated = await prisma.cours.update({ where: { id }, data: input });
  return updated;
}

export async function deleteCoursService(id: number, user: { id: number; role: string }) {
  const existing = await prisma.cours.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Cours introuvable");

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== existing.mentorId) throw new HttpError(403, "Vous ne pouvez supprimer que vos cours");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  await prisma.cours.delete({ where: { id } });
  return { success: true };
}

