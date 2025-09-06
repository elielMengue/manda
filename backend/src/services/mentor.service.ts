import { prisma } from "../db/prisma";
import { HttpError } from "../middlewares/error";

export async function listMyCoursesWithCountsService(userId: number) {
  const mentor = await prisma.mentor.findUnique({ where: { userId } });
  if (!mentor) throw new HttpError(400, "Profil mentor introuvable");
  const courses = await prisma.cours.findMany({
    where: { mentorId: mentor.id },
    include: {
      _count: {
        select: { inscriptions: true, modules: true, notifications: false, certificats: false },
      },
      modules: { select: { id: true, _count: { select: { lessons: true, quizzes: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  const items = courses.map((c) => ({
    id: c.id,
    titre: c.titre,
    duree: c.duree,
    status: c.status,
    imageUrl: c.imageUrl,
    inscriptionsCount: c._count.inscriptions,
    modulesCount: c._count.modules,
    lessonsCount: c.modules.reduce((acc, m) => acc + m._count.lessons, 0),
    quizzesCount: c.modules.reduce((acc, m) => acc + m._count.quizzes, 0),
  }));
  const totals = items.reduce(
    (acc, it) => {
      acc.courses += 1;
      acc.modules += it.modulesCount;
      acc.lessons += it.lessonsCount;
      acc.quizzes += it.quizzesCount;
      acc.inscriptions += it.inscriptionsCount;
      return acc;
    },
    { courses: 0, modules: 0, lessons: 0, quizzes: 0, inscriptions: 0 }
  );
  return { items, totals };
}

export async function listMentorsService() {
  const mentors = await prisma.mentor.findMany({
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    orderBy: { id: "asc" },
  });
  return mentors.map((m) => ({
    id: m.id,
    userId: m.userId,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    email: m.user.email,
  }));
}
