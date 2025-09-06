import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../middlewares/error";
import { createPostService, deletePostService, getPostService, listPostsService, updatePostService } from "../services/post.service";
import { createPostSchema, updatePostSchema } from "../validators/post.schema";

export async function listPostsHandler(_req: Request, res: Response, next: NextFunction) {
  try { const items = await listPostsService(); res.json(items); } catch (err) { next(err); }
}

export async function getPostHandler(req: Request, res: Response, next: NextFunction) {
  try { const id = Number(req.params.id); if (!id) throw new HttpError(400, "id invalide"); const item = await getPostService(id); res.json(item); } catch (err) { next(err); }
}

export async function createPostHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const { title, content, dateExpiration, imageUrl, typeOportunite, status } = parsed.data;
    const created = await createPostService(req.user.id, { title, content, dateExpiration, imageUrl, typeOportunite, status });
    res.status(201).json(created);
  } catch (err) { next(err); }
}

export async function updatePostHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id); if (!id) throw new HttpError(400, "id invalide");
    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const updated = await updatePostService(req.user, id, parsed.data);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function deletePostHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id); if (!id) throw new HttpError(400, "id invalide");
    const out = await deletePostService(req.user, id);
    res.json(out);
  } catch (err) { next(err); }
}
