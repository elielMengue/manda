import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { getUserHandler, listUsersHandler, updateMeHandler, updateUserHandler } from "../controllers/user.controller";

const router = Router();

router.get("/users", requireAuth, requireRole("Admin"), listUsersHandler);
router.get("/users/:id", requireAuth, requireRole("Admin"), getUserHandler);
router.patch("/users/:id", requireAuth, requireRole("Admin"), updateUserHandler);
router.patch("/me", requireAuth, updateMeHandler);

export default router;

