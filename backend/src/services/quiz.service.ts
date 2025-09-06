import { prisma } from "../db/prisma";
import type {
  SubmitQuizInput,
  CreateQuizInput,
  UpdateQuizInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  CreateOptionInput,
  UpdateOptionInput,
  CreateReponseInput,
  UpdateReponseInput,
} from "../validators/quiz.schema";
import { HttpError } from "../middlewares/error";

export async function getQuizDeepService(id: number) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          options: true,
          reponses: true,
        },
      },
    },
  });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  return quiz;
}

export async function getQuizPublicService(id: number) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          options: { select: { id: true, optionText: true } },
        },
      },
    },
  });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  return quiz;
}

export async function submitQuizService(userId: number, quizId: number, input: SubmitQuizInput) {
  // valider apprenant
  const apprenant = await prisma.apprenant.findUnique({ where: { userId } });
  if (!apprenant) throw new HttpError(400, "Profil apprenant requis");
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { include: { options: true, reponses: true } },
    },
  });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");

  // corriger
  let score = 0;
  const answersMap = new Map(input.answers.map(a => [a.questionId, a]));
  for (const q of quiz.questions) {
    const a = answersMap.get(q.id);
    if (!a) continue;
    if (q.typeQuestion.toLowerCase().includes("qcm")) {
      const correctIds = new Set(q.options.filter(o => o.isCorrect).map(o => o.id));
      const selected = new Set(a.optionIds || []);
      if (correctIds.size === selected.size && [...correctIds].every(id => selected.has(id))) {
        score += q.points || 1;
      }
    } else {
      const expected = (q.reponses[0]?.reponseText || "").trim().toLowerCase();
      const got = (a.reponseText || "").trim().toLowerCase();
      if (expected && got && expected === got) score += q.points || 1;
    }
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId,
      apprenantId: apprenant.id,
      score,
      answers: input as any,
    },
  });
  return { attemptId: attempt.id, score };
}

// Management
export async function listQuizzesForModuleService(moduleId: number) {
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  return prisma.quiz.findMany({ where: { moduleId }, orderBy: { createdAt: "desc" } });
}

export async function createQuizService(moduleId: number, input: CreateQuizInput, user: { id: number; role: string }) {
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  return prisma.quiz.create({ data: { ...input, moduleId } });
}

export async function updateQuizService(id: number, input: UpdateQuizInput, user: { id: number; role: string }) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  return prisma.quiz.update({ where: { id }, data: input });
}

export async function deleteQuizService(id: number, user: { id: number; role: string }) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  await prisma.quiz.delete({ where: { id } });
  return { success: true };
}

export async function listQuestionsForQuizService(quizId: number) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  return prisma.question_quiz.findMany({ where: { quizId }, orderBy: { ordre: "asc" } });
}

export async function createQuestionService(quizId: number, input: CreateQuestionInput, user: { id: number; role: string }) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  return prisma.question_quiz.create({ data: { ...input, quizId } });
}

export async function updateQuestionService(id: number, input: UpdateQuestionInput, user: { id: number; role: string }) {
  const question = await prisma.question_quiz.findUnique({ where: { id } });
  if (!question) throw new HttpError(404, "Question introuvable");
  const quiz = await prisma.quiz.findUnique({ where: { id: question.quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  return prisma.question_quiz.update({ where: { id }, data: input });
}

export async function deleteQuestionService(id: number, user: { id: number; role: string }) {
  const question = await prisma.question_quiz.findUnique({ where: { id } });
  if (!question) throw new HttpError(404, "Question introuvable");
  const quiz = await prisma.quiz.findUnique({ where: { id: question.quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  await prisma.question_quiz.delete({ where: { id } });
  return { success: true };
}

export async function listOptionsForQuestionService(questionId: number) {
  const q = await prisma.question_quiz.findUnique({ where: { id: questionId } });
  if (!q) throw new HttpError(404, "Question introuvable");
  return prisma.option_reponse.findMany({ where: { questionId } });
}

export async function createOptionService(questionId: number, input: CreateOptionInput, user: { id: number; role: string }) {
  const q = await prisma.question_quiz.findUnique({ where: { id: questionId } });
  if (!q) throw new HttpError(404, "Question introuvable");
  const quiz = await prisma.quiz.findUnique({ where: { id: q.quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  return prisma.option_reponse.create({ data: { ...input, questionId } });
}

export async function updateOptionService(id: number, input: UpdateOptionInput, user: { id: number; role: string }) {
  const opt = await prisma.option_reponse.findUnique({ where: { id } });
  if (!opt) throw new HttpError(404, "Option introuvable");
  const q = await prisma.question_quiz.findUnique({ where: { id: opt.questionId } });
  if (!q) throw new HttpError(404, "Question introuvable");
  const quiz = await prisma.quiz.findUnique({ where: { id: q.quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  return prisma.option_reponse.update({ where: { id }, data: input });
}

export async function deleteOptionService(id: number, user: { id: number; role: string }) {
  const opt = await prisma.option_reponse.findUnique({ where: { id } });
  if (!opt) throw new HttpError(404, "Option introuvable");
  const q = await prisma.question_quiz.findUnique({ where: { id: opt.questionId } });
  if (!q) throw new HttpError(404, "Question introuvable");
  const quiz = await prisma.quiz.findUnique({ where: { id: q.quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  await prisma.option_reponse.delete({ where: { id } });
  return { success: true };
}

export async function listReponsesForQuestionService(questionId: number) {
  const q = await prisma.question_quiz.findUnique({ where: { id: questionId } });
  if (!q) throw new HttpError(404, "Question introuvable");
  return prisma.reponse_correct.findMany({ where: { questionId } });
}

export async function createReponseService(questionId: number, input: CreateReponseInput, user: { id: number; role: string }) {
  const q = await prisma.question_quiz.findUnique({ where: { id: questionId } });
  if (!q) throw new HttpError(404, "Question introuvable");
  const quiz = await prisma.quiz.findUnique({ where: { id: q.quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  return prisma.reponse_correct.create({ data: { ...input, questionId } });
}

export async function updateReponseService(id: number, input: UpdateReponseInput, user: { id: number; role: string }) {
  const rep = await prisma.reponse_correct.findUnique({ where: { id } });
  if (!rep) throw new HttpError(404, "Réponse introuvable");
  const q = await prisma.question_quiz.findUnique({ where: { id: rep.questionId } });
  if (!q) throw new HttpError(404, "Question introuvable");
  const quiz = await prisma.quiz.findUnique({ where: { id: q.quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  return prisma.reponse_correct.update({ where: { id }, data: input });
}

export async function deleteReponseService(id: number, user: { id: number; role: string }) {
  const rep = await prisma.reponse_correct.findUnique({ where: { id } });
  if (!rep) throw new HttpError(404, "Réponse introuvable");
  const q = await prisma.question_quiz.findUnique({ where: { id: rep.questionId } });
  if (!q) throw new HttpError(404, "Question introuvable");
  const quiz = await prisma.quiz.findUnique({ where: { id: q.quizId } });
  if (!quiz) throw new HttpError(404, "Quiz introuvable");
  const mod = await prisma.module.findUnique({ where: { id: quiz.moduleId } });
  if (!mod) throw new HttpError(404, "Module introuvable");
  const cours = await prisma.cours.findUnique({ where: { id: mod.coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (user.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: user.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (user.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  await prisma.reponse_correct.delete({ where: { id } });
  return { success: true };
}
