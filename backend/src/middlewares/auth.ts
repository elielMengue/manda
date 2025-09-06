import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { HttpError } from "./error";

export type AuthUser = {
  id: number;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authorization header manquant"));
  }
  const token = header.slice(7);
  try {
    const payload = verifyToken<{ sub: number; role: string }>(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(new HttpError(401, "Token invalide ou expiré"));
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, "Non authentifié"));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, "Accès refusé"));
    return next();
  };
}

