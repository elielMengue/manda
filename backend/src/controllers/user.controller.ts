import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../validators/pagination";
import { updateUserSchema } from "../validators/user.schema";
import { getUserService, listUsersService, updateUserService } from "../services/user.service";
import { HttpError } from "../middlewares/error";

export async function listUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { skip, take, page, pageSize } = parsePagination(req.query as any);
    const { items, total } = await listUsersService(skip, take);
    res.json({ items, total, page, pageSize });
  } catch (err) { next(err); }
}

export async function getUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const item = await getUserService(id);
    res.json(item);
  } catch (err) { next(err); }
}

export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await updateUserService(id, parsed.data);
    res.json(out);
  } catch (err) { next(err); }
}

export async function updateMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const parsed = updateUserSchema.omit({ role: true, status: true }).safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await updateUserService(req.user.id, parsed.data as any);
    res.json(out);
  } catch (err) { next(err); }
}

