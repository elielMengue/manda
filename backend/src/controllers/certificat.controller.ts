import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../middlewares/error";
import { generateCertificatePdfService, issueCertificateService } from "../services/certificat.service";

export async function issueCertificateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const apprenantUserId = Number(req.body?.apprenantUserId);
    const coursId = Number(req.body?.coursId);
    if (!apprenantUserId || !coursId) throw new HttpError(400, "apprenantUserId et coursId requis");
    const cert = await issueCertificateService(req.user.id, apprenantUserId, coursId);
    res.status(201).json(cert);
  } catch (err) { next(err); }
}

export async function certificatePdfHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const pdf = await generateCertificatePdfService(id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=certificat-${id}.pdf`);
    res.send(pdf);
  } catch (err) { next(err); }
}

