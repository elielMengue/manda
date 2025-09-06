import type { Request, Response, NextFunction } from "express";
import { listMyNotifications, markNotificationRead } from "../services/notification.service";
import { HttpError } from "../middlewares/error";

export async function listMyNotificationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const items = await listMyNotifications(req.user.id);
    res.json(items);
  } catch (err) { next(err); }
}

export async function markNotificationReadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    await markNotificationRead(req.user.id, id);
    res.status(204).send();
  } catch (err) { next(err); }
}

