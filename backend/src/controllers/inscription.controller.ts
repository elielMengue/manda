import type { Request, Response, NextFunction } from "express";
import { enrollService, listMyInscriptionsService, updateProgressionService, listInscriptionsForCourseService } from "../services/inscription.service";
import { HttpError } from "../middlewares/error";
import { updateProgressSchema } from "../validators/inscription.schema";

export async function enrollHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const coursId = Number(req.params.coursId);
    if (!coursId) throw new HttpError(400, "coursId invalide");
    const out = await enrollService(req.user.id, coursId);
    res.status(201).json(out);
  } catch (err) { next(err); }
}

export async function listMyInscriptionsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const items = await listMyInscriptionsService(req.user.id);
    res.json(items);
  } catch (err) { next(err); }
}

export async function updateProgressionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateProgressSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await updateProgressionService(req.user.id, id, parsed.data.progression);
    res.json(out);
  } catch (err) { next(err); }
}

export async function listInscriptionsForCourseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const coursId = Number(req.params.coursId);
    if (!coursId) throw new HttpError(400, "coursId invalide");
    const items = await listInscriptionsForCourseService(req.user, coursId);
    res.json(items);
  } catch (err) { next(err); }
}
