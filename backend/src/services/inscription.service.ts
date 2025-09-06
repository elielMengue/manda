import { prisma } from "../db/prisma";
import { HttpError } from "../middlewares/error";

export async function enrollService(userId: number, coursId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "Utilisateur introuvable");
  if (user.role !== "Apprenant") throw new HttpError(403, "Seuls les apprenants peuvent s'inscrire");

  const apprenant = await prisma.apprenant.findUnique({ where: { userId } });
  if (!apprenant) throw new HttpError(400, "Profil apprenant requis");

  const cours = await prisma.cours.findUnique({ where: { id: coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");

  const exists = await prisma.inscription.findFirst({ where: { apprenantId: apprenant.id, coursId } });
  if (exists) return { id: exists.id };

  const dateFin = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const created = await prisma.inscription.create({
    data: {
      apprenantId: apprenant.id,
      coursId,
      status: "active",
      dateFin,
      progression: 0,
    },
    select: { id: true },
  });
  return created;
}

export async function listMyInscriptionsService(userId: number) {
  const apprenant = await prisma.apprenant.findUnique({ where: { userId } });
  if (!apprenant) throw new HttpError(400, "Profil apprenant requis");
  const items = await prisma.inscription.findMany({
    where: { apprenantId: apprenant.id },
    include: { cours: true },
    orderBy: { inscriptionDate: "desc" },
  });
  return items;
}

export async function updateProgressionService(userId: number, inscriptionId: number, progression: number) {
  const apprenant = await prisma.apprenant.findUnique({ where: { userId } });
  if (!apprenant) throw new HttpError(400, "Profil apprenant requis");
  const ins = await prisma.inscription.findUnique({ where: { id: inscriptionId } });
  if (!ins || ins.apprenantId !== apprenant.id) throw new HttpError(404, "Inscription introuvable");
  const updated = await prisma.inscription.update({ where: { id: inscriptionId }, data: { progression } });
  return { id: updated.id, progression: updated.progression };
}

export async function listInscriptionsForCourseService(requestUser: { id: number; role: string }, coursId: number) {
  const cours = await prisma.cours.findUnique({ where: { id: coursId } });
  if (!cours) throw new HttpError(404, "Cours introuvable");
  if (requestUser.role === "Mentor") {
    const mentor = await prisma.mentor.findUnique({ where: { userId: requestUser.id } });
    if (!mentor || mentor.id !== cours.mentorId) throw new HttpError(403, "Accès refusé");
  } else if (requestUser.role !== "Admin") {
    throw new HttpError(403, "Accès refusé");
  }
  const items = await prisma.inscription.findMany({
    where: { coursId },
    include: { apprenant: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } } },
    orderBy: { inscriptionDate: "desc" },
    take: 500,
  });
  return items.map((ins) => ({
    id: ins.id,
    apprenantUserId: ins.apprenant.user.id,
    apprenantName: `${ins.apprenant.user.firstName} ${ins.apprenant.user.lastName}`.trim(),
    apprenantEmail: ins.apprenant.user.email,
    progression: ins.progression,
    inscriptionDate: ins.inscriptionDate,
    status: ins.status,
  }));
}
