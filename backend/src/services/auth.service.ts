import { prisma } from "../db/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import type { RegisterInput, LoginInput } from "../validators/auth.schema";
import { signToken } from "../utils/jwt";
import { HttpError } from "../middlewares/error";
import { Role } from "@prisma/client";
import { randomToken, sha256 } from "../utils/token";
import type { OAuthInput } from "../validators/oauth.schema";

const REFRESH_TTL_DAYS = 7;
const msPerDay = 24 * 60 * 60 * 1000;

export async function registerService(input: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new HttpError(409, "Email déjà utilisé");

  const password = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      address: input.address,
      phone: input.phone,
      status: true,
      photoUrl: input.photoUrl,
      password,
      role: Role.Apprenant,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const accessToken = signToken({ sub: user.id, role: user.role });
  const { refreshToken, refreshTokenHash, expiresAt } = await issueRefreshToken(user.id);
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: refreshTokenHash, expiresAt } });
  return { user, accessToken, refreshToken };
}

export async function loginService(input: LoginInput) {
  let user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    // Bootstrap admin if none exists and provided credentials match env defaults
    const adminEmail = process.env.ADMIN_EMAIL || "admin@eduimpact.test";
    const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const adminCount = await prisma.user.count({ where: { role: Role.Admin } });
    if (adminCount === 0 && input.email === adminEmail && input.password === adminPassword) {
      const password = await hashPassword(input.password);
      user = await prisma.user.create({
        data: {
          firstName: "Admin",
          lastName: "EduImpact",
          email: adminEmail,
          address: "-",
          phone: "-",
          status: true,
          photoUrl: "",
          password,
          role: Role.Admin,
        },
      });
      try {
        await prisma.admin.create({ data: { userId: user.id } });
      } catch {
        // ignore if already exists
      }
    } else {
      throw new HttpError(401, "Identifiants invalides");
    }
  }
  const ok = await comparePassword(input.password, user.password);
  if (!ok) throw new HttpError(401, "Identifiants invalides");

  const accessToken = signToken({ sub: user.id, role: user.role });
  const { refreshToken, refreshTokenHash, expiresAt } = await issueRefreshToken(user.id);
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: refreshTokenHash, expiresAt } });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshService(refreshTokenPlain: string) {
  const tokenHash = sha256(refreshTokenPlain);
  const existing = await prisma.refreshToken.findFirst({ where: { tokenHash, revoked: false } });
  if (!existing) throw new HttpError(401, "Refresh token invalide");
  if (existing.expiresAt.getTime() < Date.now()) throw new HttpError(401, "Refresh token expiré");

  await prisma.refreshToken.update({ where: { id: existing.id }, data: { revoked: true } });
  const { refreshToken, refreshTokenHash, expiresAt } = await issueRefreshToken(existing.userId);
  await prisma.refreshToken.create({ data: { userId: existing.userId, tokenHash: refreshTokenHash, expiresAt } });

  const user = await prisma.user.findUnique({ where: { id: existing.userId } });
  if (!user) throw new HttpError(401, "Utilisateur introuvable");
  const accessToken = signToken({ sub: user.id, role: user.role });
  return { accessToken, refreshToken };
}

export async function logoutService(refreshTokenPlain: string) {
  const tokenHash = sha256(refreshTokenPlain);
  await prisma.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true } });
}

export async function requestPasswordResetService(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: true };
  const token = randomToken(32);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
  return { ok: true, token };
}

export async function resetPasswordService(tokenPlain: string, newPassword: string) {
  const tokenHash = sha256(tokenPlain);
  const rec = await prisma.passwordResetToken.findFirst({ where: { tokenHash, used: false } });
  if (!rec) throw new HttpError(400, "Token invalide");
  if (rec.expiresAt.getTime() < Date.now()) throw new HttpError(400, "Token expiré");
  const password = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: rec.userId }, data: { password } }),
    prisma.passwordResetToken.update({ where: { id: rec.id }, data: { used: true } }),
  ]);
  return { ok: true };
}

async function issueRefreshToken(userId: number) {
  const refreshToken = randomToken(48);
  const refreshTokenHash = sha256(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * msPerDay);
  return { refreshToken, refreshTokenHash, expiresAt };
}

export async function oauthLoginService(input: OAuthInput) {
  const { provider, providerAccountId, email } = input;
  // 1) account exists?
  const account = await prisma.oAuthAccount.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  });
  let user = account?.user ?? null;
  // 2) else try by email
  if (!user) {
    user = await prisma.user.findUnique({ where: { email } });
  }
  // 3) else create user
  if (!user) {
    const password = await hashPassword(randomToken(16));
    user = await prisma.user.create({
      data: {
        firstName: input.firstName || email.split("@")[0],
        lastName: input.lastName || "",
        email,
        address: "-",
        phone: "-",
        status: true,
        photoUrl: input.photoUrl || "",
        password,
        role: Role.Apprenant,
      },
    });
  }
  // 4) ensure account link exists
  try {
    await prisma.oAuthAccount.create({ data: { provider, providerAccountId, userId: user.id } });
  } catch {
    // already linked
  }
  const accessToken = signToken({ sub: user.id, role: user.role });
  const { refreshToken, refreshTokenHash, expiresAt } = await issueRefreshToken(user.id);
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: refreshTokenHash, expiresAt } });
  return {
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
}
