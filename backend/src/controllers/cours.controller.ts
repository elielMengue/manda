import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../validators/pagination";
import { createCoursSchema, updateCoursSchema } from "../validators/cours.schema";
import {
  listCoursService,
  getCoursService,
  createCoursService,
  updateCoursService,
  deleteCoursService,
} from "../services/cours.service";
import { HttpError } from "../middlewares/error";

export async function listCoursHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { skip, take, page, pageSize } = parsePagination(req.query as any);
    const { items, total } = await listCoursService(skip, take);
    res.json({ items, total, page, pageSize });
  } catch (err) {
    next(err);
  }
}

export async function getCoursHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const item = await getCoursService(id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function createCoursHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createCoursSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const created = await createCoursService(parsed.data, req.user!);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function updateCoursHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateCoursSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const updated = await updateCoursService(id, parsed.data, req.user!);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteCoursHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const result = await deleteCoursService(id, req.user!);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

