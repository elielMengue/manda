import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  listLessonsForModuleHandler,
  createLessonHandler,
  getLessonHandler,
  updateLessonHandler,
  deleteLessonHandler,
  completeLessonHandler,
} from "../controllers/lesson.controller";

const router = Router();

router.get("/modules/:moduleId/lessons", listLessonsForModuleHandler);
router.post("/modules/:moduleId/lessons", requireAuth, createLessonHandler);
router.get("/lessons/:id", getLessonHandler);
router.patch("/lessons/:id", requireAuth, updateLessonHandler);
router.delete("/lessons/:id", requireAuth, deleteLessonHandler);
router.post("/lessons/:id/complete", requireAuth, completeLessonHandler);

export default router;
