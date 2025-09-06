import { prisma } from "../db/prisma";
import type { CreateLessonInput, UpdateLessonInput } from "../validators/lesson.schema";
import { HttpError } from "../middlewares/error";

export async function listLessonsForModuleService(moduleId: number) {
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const items = await prisma.lesson.findMany({ where: { moduleId }, orderBy: { ordre: "asc" } });
  return items;
}

export async function createLessonService(moduleId: number, input: CreateLessonInput, user: { id: number; role: string }) {
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Vous ne pouvez modifier que vos cours");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  const created = await prisma.lesson.create({ data: { ...input, moduleId } });
  return created;
}

export async function getLessonService(id: number) {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new HttpError(404, "Leçon introuvable");
  return lesson;
}

export async function updateLessonService(id: number, input: UpdateLessonInput, user: { id: number; role: string }) {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new HttpError(404, "Leçon introuvable");
  const mod = await prisma.module.findUnique({ where: { id: lesson.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Vous ne pouvez modifier que vos cours");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  const updated = await prisma.lesson.update({ where: { id }, data: input });
  return updated;
}

export async function deleteLessonService(id: number, user: { id: number; role: string }) {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new HttpError(404, "Leçon introuvable");
  const mod = await prisma.module.findUnique({ where: { id: lesson.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");

  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Vous ne pouvez modifier que vos cours");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  await prisma.lesson.delete({ where: { id } });
  return { success: true };
}

export async function completeLessonService(userId: number, lessonId: number) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw new HttpError(404, "Leçon introuvable");
  const mod = await prisma.module.findUnique({ where: { id: lesson.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");

  const apprenant = await prisma.apprenant.findUnique({ where: { userId } });
  if (!apprenant) throw new HttpError(400, "Profil apprenant requis");

  const inscription = await prisma.inscription.findFirst({ where: { apprenantId: apprenant.id, coursId: cours.id } });
  if (!inscription) throw new HttpError(403, "Non inscrit à ce cours");

  await prisma.completedLesson.upsert({
    where: { lessonId_apprenantId: { lessonId: lesson.id, apprenantId: apprenant.id } },
    create: { lessonId: lesson.id, apprenantId: apprenant.id },
    update: {},
  });

  const [completedCount, totalLessons] = await Promise.all([
    prisma.completedLesson.count({ where: { apprenantId: apprenant.id, lesson: { module: { coursId: cours.id } } } }),
    prisma.lesson.count({ where: { module: { coursId: cours.id } } }),
  ]);
  const progression = totalLessons > 0 ? Math.floor((completedCount / totalLessons) * 100) : 0;
  await prisma.inscription.update({ where: { id: inscription.id }, data: { progression } });
  return { progression };
}
