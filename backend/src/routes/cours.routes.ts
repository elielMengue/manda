import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  listCoursHandler,
  getCoursHandler,
  createCoursHandler,
  updateCoursHandler,
  deleteCoursHandler,
  duplicateCoursHandler,
} from "../controllers/cours.controller";

const router = Router();

router.get("/", listCoursHandler);
router.get("/:id", getCoursHandler);
router.post("/", requireAuth, createCoursHandler);
router.patch("/:id", requireAuth, updateCoursHandler);
router.delete("/:id", requireAuth, deleteCoursHandler);
router.post("/:id/duplicate", requireAuth, duplicateCoursHandler);

export default router;
