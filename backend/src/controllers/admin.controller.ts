import type { Request, Response, NextFunction } from "express";
import { getAdminMetricsService, notifyUsersByFilterService, resetUserPasswordService, exportUsersCsvService, adminSendMessagesService } from "../services/admin.service";
import { hashPassword } from "../utils/hash";
import { prisma } from "../db/prisma";
import { Role } from "@prisma/client";
import { loginService } from "../services/auth.service";

export async function getAdminMetricsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAdminMetricsService();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function notifyUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userIds, role, title, content } = req.body || {};
    if (!title || !content) return res.status(400).json({ error: "title et content requis" });
    const out = await notifyUsersByFilterService({ userIds, role, title, content });
    res.status(201).json(out);
  } catch (err) { next(err); }
}

export async function resetUserPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "id invalide" });
    const { newPassword } = req.body || {};
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) return res.status(400).json({ error: "newPassword invalide" });
    const hash = await hashPassword(newPassword);
    const out = await resetUserPasswordService(id, hash);
    res.json(out);
  } catch (err) { next(err); }
}

export async function exportUsersCsvHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const csv = await exportUsersCsvService();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  } catch (err) { next(err); }
}

export async function bootstrapAdminHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const setupToken = process.env.ADMIN_SETUP_TOKEN || "";
    const headerToken = String(req.headers["x-admin-setup"] || "");
    const admins = await prisma.user.count({ where: { role: Role.Admin } });
    if (admins > 0 && (!setupToken || headerToken !== setupToken)) {
      return res.status(403).json({ error: "Setup protégé. Fourni x-admin-setup." });
    }
    const email = process.env.ADMIN_EMAIL || "admin@eduimpact.test";
    const passwordPlain = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const password = await hashPassword(passwordPlain);
    const existing = await prisma.user.findUnique({ where: { email } });
    const user = existing
      ? await prisma.user.update({ where: { id: existing.id }, data: { firstName: "Admin", lastName: "EduImpact", password, role: Role.Admin } })
      : await prisma.user.create({ data: { firstName: "Admin", lastName: "EduImpact", email, address: "-", phone: "-", status: true, photoUrl: "", password, role: Role.Admin } });
    try { await prisma.admin.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} }); } catch {}
    res.status(201).json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (err) { next(err); }
}

export async function devAdminLoginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const setupToken = process.env.ADMIN_SETUP_TOKEN || "";
    const headerToken = String(req.headers["x-admin-setup"] || "");
    if (!setupToken || headerToken !== setupToken) return res.status(403).json({ error: "Forbidden" });
    const email = process.env.ADMIN_EMAIL || "admin@eduimpact.test";
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    // ensure exists
    const admins = await prisma.user.count({ where: { role: Role.Admin } });
    if (admins === 0) {
      const hash = await hashPassword(password);
      const user = await prisma.user.create({ data: { firstName: "Admin", lastName: "EduImpact", email, address: "-", phone: "-", status: true, photoUrl: "", password: hash, role: Role.Admin } });
      try { await prisma.admin.create({ data: { userId: user.id } }); } catch {}
    }
    const out = await loginService({ email, password });
    res.json(out);
  } catch (err) { next(err); }
}

export async function adminSendMessagesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: "Non authentifié" });
    const { content, userIds, role } = req.body || {};
    if (!content || typeof content !== 'string') return res.status(400).json({ error: 'content requis' });
    const out = await adminSendMessagesService(req.user.id, { content, userIds, role });
    res.status(201).json(out);
  } catch (err) { next(err); }
}
