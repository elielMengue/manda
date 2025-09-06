import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { createApprenantProfileHandler, createMentorProfileHandler, createPartenaireProfileHandler, getMyProfileHandler } from "../controllers/profile.controller";

const router = Router();

router.get("/profiles/me", requireAuth, getMyProfileHandler);
router.post("/profiles/apprenant", requireAuth, createApprenantProfileHandler);
router.post("/profiles/mentor", requireAuth, createMentorProfileHandler);
router.post("/profiles/partenaire", requireAuth, createPartenaireProfileHandler);

export default router;

