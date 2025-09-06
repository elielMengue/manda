import type { Request, Response, NextFunction } from "express";
import { createLessonSchema, updateLessonSchema } from "../validators/lesson.schema";
import {
  listLessonsForModuleService,
  createLessonService,
  getLessonService,
  updateLessonService,
  deleteLessonService,
  completeLessonService,
} from "../services/lesson.service";
import { HttpError } from "../middlewares/error";

export async function listLessonsForModuleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const moduleId = Number(req.params.moduleId);
    if (!moduleId) throw new HttpError(400, "moduleId invalide");
    const items = await listLessonsForModuleService(moduleId);
    res.json(items);
  } catch (err) { next(err); }
}

export async function createLessonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const moduleId = Number(req.params.moduleId);
    if (!moduleId) throw new HttpError(400, "moduleId invalide");
    const parsed = createLessonSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const created = await createLessonService(moduleId, parsed.data, req.user!);
    res.status(201).json(created);
  } catch (err) { next(err); }
}

export async function getLessonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const item = await getLessonService(id);
    res.json(item);
  } catch (err) { next(err); }
}

export async function updateLessonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateLessonSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const updated = await updateLessonService(id, parsed.data, req.user!);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function deleteLessonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const out = await deleteLessonService(id, req.user!);
    res.json(out);
  } catch (err) { next(err); }
}

export async function completeLessonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const out = await completeLessonService(req.user.id, id);
    res.json(out);
  } catch (err) { next(err); }
}
