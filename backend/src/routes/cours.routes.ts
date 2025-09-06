import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  listCoursHandler,
  getCoursHandler,
  createCoursHandler,
  updateCoursHandler,
  deleteCoursHandler,
} from "../controllers/cours.controller";

const router = Router();

router.get("/", listCoursHandler);
router.get("/:id", getCoursHandler);
router.post("/", requireAuth, createCoursHandler);
router.patch("/:id", requireAuth, updateCoursHandler);
router.delete("/:id", requireAuth, deleteCoursHandler);

export default router;

