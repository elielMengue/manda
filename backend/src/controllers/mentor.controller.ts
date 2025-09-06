import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../middlewares/error";
import { listMentorsService, listMyCoursesWithCountsService } from "../services/mentor.service";

export async function myCoursesSummaryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const out = await listMyCoursesWithCountsService(req.user.id);
    res.json(out);
  } catch (err) {
    next(err);
  }
}

export async function listMentorsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await listMentorsService();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
