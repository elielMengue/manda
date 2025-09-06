import { sign as jwtSign, verify as jwtVerify, Secret } from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = { sub: number; role: string };

const secret: Secret = env.jwtSecret as unknown as Secret;

export function signToken(payload: JwtPayload, expiresInSec: number = 24 * 60 * 60) {
  return jwtSign(payload, secret, { expiresIn: expiresInSec });
}

export function verifyToken<T = JwtPayload>(token: string): T {
  return jwtVerify(token, secret) as T;
}
