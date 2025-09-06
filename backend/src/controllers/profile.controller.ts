import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../middlewares/error";
import { createApprenantProfile, createMentorProfile, createPartenaireProfile, getMyProfile } from "../services/profile.service";
import { createApprenantProfileSchema, createMentorProfileSchema, createPartenaireProfileSchema } from "../validators/profile.schema";

export async function createApprenantProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const parsed = createApprenantProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await createApprenantProfile(req.user.id, parsed.data);
    res.status(201).json(out);
  } catch (err) { next(err); }
}

export async function createMentorProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const parsed = createMentorProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await createMentorProfile(req.user.id, parsed.data);
    res.status(201).json(out);
  } catch (err) { next(err); }
}

export async function createPartenaireProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const parsed = createPartenaireProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await createPartenaireProfile(req.user.id, parsed.data);
    res.status(201).json(out);
  } catch (err) { next(err); }
}

export async function getMyProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const out = await getMyProfile(req.user.id);
    res.json(out);
  } catch (err) { next(err); }
}

