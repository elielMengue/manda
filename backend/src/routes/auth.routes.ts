import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  loginHandler,
  registerHandler,
  refreshHandler,
  logoutHandler,
  requestPasswordResetHandler,
  resetPasswordHandler,
  oauthHandler,
} from "../controllers/auth.controller";

const router = Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

router.post("/register", limiter, registerHandler);
router.post("/login", limiter, loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);
router.post("/password/forgot", requestPasswordResetHandler);
router.post("/password/reset", resetPasswordHandler);
router.post("/oauth", oauthHandler);

export default router;
