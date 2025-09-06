import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8080),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  databaseUrl: process.env.DATABASE_URL || "",
};

export function assertEnv() {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL manquant. Configurez votre .env");
  }
  if (!env.jwtSecret || env.jwtSecret === "change-me") {
    // non bloquant mais recommandé
    // eslint-disable-next-line no-console
    console.warn("JWT_SECRET non sécurisé. Pensez à le changer en production.");
  }
}

