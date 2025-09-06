import { prisma } from "../db/prisma";
import type { CreateCoursInput, UpdateCoursInput } from "../validators/cours.schema";
import { HttpError } from "../middlewares/error";
import { Prisma } from "@prisma/client";

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

  const status = (input as any).status && String((input as any).status).trim() ? (input as any).status : 'published';
  const created = await prisma.cours.create({ data: { ...input, status, mentorId } });
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

export async function duplicateCoursService(id: number, user: { id: number; role: string }) {
  const existing = await prisma.cours.findUnique({
    where: { id },
    include: {
      mentor: true,
      modules: {
        include: {
          lessons: true,
          quizzes: {
            include: {
              questions: {
                include: { options: true, reponses: true },
              },
            },
          },
        },
      },
    },
  });
  if (!existing) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== existing.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }

  const titre = `${existing.titre} (copie)`;
  return await prisma.$transaction(async (tx) => {
    const newCours = await tx.cours.create({
      data: {
        titre,
        description: existing.description,
        duree: existing.duree,
        status: 'draft',
        imageUrl: existing.imageUrl,
        mentorId: existing.mentorId,
      },
    });

    for (const mod of existing.modules) {
      const newMod = await tx.module.create({
        data: {
          titre: mod.titre,
          description: mod.description,
          ordre: mod.ordre,
          duree: mod.duree,
          coursId: newCours.id,
        },
      });
      for (const les of mod.lessons) {
        await tx.lesson.create({
          data: {
            titre: les.titre,
            textContenu: les.textContenu,
            duree: les.duree,
            type: les.type,
            ordre: les.ordre,
            videoUrl: les.videoUrl,
            moduleId: newMod.id,
          },
        });
      }
      for (const qz of (mod as any).quizzes) {
        const newQuiz = await tx.quiz.create({
          data: {
            titre: qz.titre,
            description: qz.description,
            dureeMax: qz.dureeMax,
            nombreTentatives: qz.nombreTentatives,
            scoreMinReussite: qz.scoreMinReussite,
            type: qz.type,
            moduleId: newMod.id,
          },
        });
        for (const qu of qz.questions) {
          const newQu = await tx.question_quiz.create({
            data: {
              questionText: qu.questionText,
              ordre: qu.ordre,
              points: qu.points,
              typeQuestion: qu.typeQuestion,
              quizId: newQuiz.id,
            },
          });
          for (const opt of qu.options) {
            await tx.option_reponse.create({
              data: { optionText: opt.optionText, isCorrect: opt.isCorrect, questionId: newQu.id },
            });
          }
          for (const rep of qu.reponses) {
            await tx.reponse_correct.create({
              data: { reponseText: rep.reponseText, isCorrect: rep.isCorrect, questionId: newQu.id },
            });
          }
        }
      }
    }
    return { id: newCours.id };
  });
}
