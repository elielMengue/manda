import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { listMentorsHandler, myCoursesSummaryHandler } from "../controllers/mentor.controller";

const router = Router();

router.get("/me/mentor/courses", requireAuth, requireRole("Mentor"), myCoursesSummaryHandler);
router.get("/mentors", requireAuth, requireRole("Admin"), listMentorsHandler);

export default router;
