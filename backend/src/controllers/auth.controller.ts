import type { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validators/auth.schema";
import {
  registerService,
  loginService,
  refreshService,
  logoutService,
  requestPasswordResetService,
  resetPasswordService,
} from "../services/auth.service";
import { HttpError } from "../middlewares/error";
import { oauthSchema } from "../validators/oauth.schema";
import { oauthLoginService } from "../services/auth.service";

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const result = await registerService(parsed.data);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({ user: result.user, accessToken: result.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const result = await loginService(parsed.data);
    setRefreshCookie(res, result.refreshToken);
    res.json({ user: result.user, accessToken: result.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.rt || req.body?.refreshToken;
    if (!token) throw new HttpError(400, "Refresh token manquant");
    const data = await refreshService(token);
    setRefreshCookie(res, data.refreshToken);
    res.json({ accessToken: data.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.rt || req.body?.refreshToken;
    if (token) await logoutService(token);
    clearRefreshCookie(res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function oauthHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = oauthSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await oauthLoginService(parsed.data);
    // Pour usage navigateur on pourrait set cookie; ici on renvoie tokens pour NextAuth
    res.status(200).json(out);
  } catch (err) {
    next(err);
  }
}

export async function requestPasswordResetHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const email = String(req.body?.email || "").trim();
    if (!email) throw new HttpError(400, "Email requis");
    const out = await requestPasswordResetService(email);
    // En dev, retour du token pour test
    res.status(200).json({ ok: true, token: out.token });
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(req.body?.token || "");
    const newPassword = String(req.body?.password || "");
    if (!token || !newPassword) throw new HttpError(400, "Token et mot de passe requis");
    await resetPasswordService(token, newPassword);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie("rt", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie("rt", { path: "/" });
}
