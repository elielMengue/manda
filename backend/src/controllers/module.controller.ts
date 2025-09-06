import type { Request, Response, NextFunction } from "express";
import { createModuleSchema, updateModuleSchema } from "../validators/module.schema";
import {
  listModulesForCoursService,
  createModuleService,
  getModuleService,
  updateModuleService,
  deleteModuleService,
} from "../services/module.service";
import { HttpError } from "../middlewares/error";

export async function listModulesForCoursHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const coursId = Number(req.params.coursId);
    if (!coursId) throw new HttpError(400, "coursId invalide");
    const items = await listModulesForCoursService(coursId);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function createModuleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const coursId = Number(req.params.coursId);
    if (!coursId) throw new HttpError(400, "coursId invalide");
    const parsed = createModuleSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const created = await createModuleService(coursId, parsed.data, req.user!);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function getModuleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const mod = await getModuleService(id);
    res.json(mod);
  } catch (err) {
    next(err);
  }
}

export async function updateModuleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateModuleSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const updated = await updateModuleService(id, parsed.data, req.user!);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteModuleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const result = await deleteModuleService(id, req.user!);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

