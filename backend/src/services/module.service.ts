import { prisma } from "../db/prisma";
import type { CreateModuleInput, UpdateModuleInput } from "../validators/module.schema";
import { HttpError } from "../middlewares/error";

export async function listModulesForCoursService(coursId: number) {
  const cours = await prisma.cours.findUnique({ where: { id: coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  const items = await prisma.module.findMany({ where: { coursId }, orderBy: { ordre: "asc" } });
  return items;
}

export async function createModuleService(coursId: number, input: CreateModuleInput, user: { id: number; role: string }) {
  const cours = await prisma.cours.findUnique({ where: { id: coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Vous ne pouvez modifier que vos cours");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  const created = await prisma.module.create({ data: { ...input, coursId } });
  return created;
}

export async function getModuleService(id: number) {
  const mod = await prisma.module.findUnique({ where: { id } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  return mod;
}

export async function updateModuleService(id: number, input: UpdateModuleInput, user: { id: number; role: string }) {
  const existing = await prisma.module.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Module introuvable");

  const cours = await prisma.cours.findUnique({ where: { id: existing.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Vous ne pouvez modifier que vos cours");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  const updated = await prisma.module.update({ where: { id }, data: input });
  return updated;
}

export async function deleteModuleService(id: number, user: { id: number; role: string }) {
  const existing = await prisma.module.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Module introuvable");

  const cours = await prisma.cours.findUnique({ where: { id: existing.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Vous ne pouvez modifier que vos cours");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  await prisma.module.delete({ where: { id } });
  return { success: true };
}

