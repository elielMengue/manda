import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { env, assertEnv } from "./config/env";
import { errorHandler } from "./middlewares/error";
import apiRoutes from "./routes";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi";

assertEnv();

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// Static serving for uploaded assets (videos/images)
const uploadsDir = path.join(process.cwd(), "uploads");
try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}
app.use("/uploads", express.static(uploadsDir));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "eduimpact-api", timestamp: new Date().toISOString() });
});

app.use("/api/v1", apiRoutes);

// Docs Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec as any));
app.get("/openapi.json", (_req, res) => res.json(openapiSpec));

app.use(errorHandler);
