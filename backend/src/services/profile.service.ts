import { prisma } from "../db/prisma";
import { HttpError } from "../middlewares/error";
import { Role } from "@prisma/client";

export async function createApprenantProfile(userId: number, data: { bio: string; profession: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "Utilisateur introuvable");
  const exists = await prisma.apprenant.findUnique({ where: { userId } });
  if (exists) return { id: exists.id };
  await prisma.user.update({ where: { id: userId }, data: { role: Role.Apprenant } });
  const created = await prisma.apprenant.create({ data: { userId, bio: data.bio, profession: data.profession, lastConnected: new Date() } });
  return { id: created.id };
}

export async function createMentorProfile(userId: number, data: { specialite: string; experience: string; bio: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "Utilisateur introuvable");
  const exists = await prisma.mentor.findUnique({ where: { userId } });
  if (exists) return { id: exists.id };
  await prisma.user.update({ where: { id: userId }, data: { role: Role.Mentor } });
  const created = await prisma.mentor.create({ data: { userId, specialite: data.specialite, experience: data.experience, bio: data.bio, lastConnected: new Date() } });
  return { id: created.id };
}

export async function createPartenaireProfile(userId: number, data: { organisationName: string; activitySector: string; juridicStatus: string; description: string; siteweb: string; contact: string; logoUrl: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "Utilisateur introuvable");
  const exists = await prisma.partenaire.findUnique({ where: { userId } });
  if (exists) return { id: exists.id };
  await prisma.user.update({ where: { id: userId }, data: { role: Role.Partenaire } });
  const created = await prisma.partenaire.create({ data: { userId, ...data, lastConnected: new Date() } });
  return { id: created.id };
}

export async function getMyProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "Utilisateur introuvable");
  const apprenant = await prisma.apprenant.findUnique({ where: { userId } });
  const mentor = await prisma.mentor.findUnique({ where: { userId } });
  const partenaire = await prisma.partenaire.findUnique({ where: { userId } });
  return { user, apprenant, mentor, partenaire };
}

