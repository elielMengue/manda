import { prisma } from "../db/prisma";
import { HttpError } from "../middlewares/error";

export async function listPostsService() {
  return prisma.post.findMany({ orderBy: { datePublication: "desc" }, take: 100 });
}

export async function getPostService(id: number) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new HttpError(404, "Post introuvable");
  return post;
}

export async function createPostService(userId: number, data: { title: string; content: string; dateExpiration: Date; imageUrl?: string; typeOportunite: string; status: string; }) {
  const partner = await prisma.partenaire.findUnique({ where: { userId } });
  if (!partner) throw new HttpError(403, "Profil partenaire requis");
  const created = await prisma.post.create({ data: { ...data, imageUrl: data.imageUrl ?? "", partenaireId: partner.id, userId } });
  return created;
}

export async function updatePostService(user: { id: number; role: string }, id: number, data: Partial<{ title: string; content: string; dateExpiration: Date; imageUrl?: string; typeOportunite: string; status: string; }>) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new HttpError(404, "Post introuvable");
  if (user.role === "Admin") {
    const updated = await prisma.post.update({ where: { id }, data });
    return updated;
  }
  const partner = await prisma.partenaire.findUnique({ where: { userId: user.id } });
  const isOwner = partner && post.partenaireId === partner.id;
  // Admin peut gérer tous les posts — simplification: on checkera le rôle côté middleware si nécessaire
  if (!isOwner && post.userId !== user.id) throw new HttpError(403, "Accès refusé");
  const updated = await prisma.post.update({ where: { id }, data });
  return updated;
}

export async function deletePostService(user: { id: number; role: string }, id: number) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new HttpError(404, "Post introuvable");
  if (user.role === "Admin") {
    await prisma.post.delete({ where: { id } });
    return { success: true };
  }
  const partner = await prisma.partenaire.findUnique({ where: { userId: user.id } });
  const isOwner = partner && post.partenaireId === partner.id;
  if (!isOwner && post.userId !== user.id) throw new HttpError(403, "Accès refusé");
  await prisma.post.delete({ where: { id } });
  return { success: true };
}
