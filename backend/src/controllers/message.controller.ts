import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../middlewares/error";
import { getConversationService, listConversationsService, sendMessageService } from "../services/message.service";
import { sendMessageSchema } from "../validators/message.schema";

export async function sendMessageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const parsed = sendMessageSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await sendMessageService(req.user.id, parsed.data.receiverId, parsed.data.content);
    res.status(201).json(out);
  } catch (err) { next(err); }
}

export async function listConversationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const items = await listConversationsService(req.user.id);
    res.json(items);
  } catch (err) { next(err); }
}

export async function getConversationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const otherId = Number(req.params.userId);
    if (!otherId) throw new HttpError(400, "userId invalide");
    const items = await getConversationService(req.user.id, otherId);
    res.json(items);
  } catch (err) { next(err); }
}
