import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  listModulesForCoursHandler,
  createModuleHandler,
  getModuleHandler,
  updateModuleHandler,
  deleteModuleHandler,
} from "../controllers/module.controller";

const router = Router();

router.get("/cours/:coursId/modules", listModulesForCoursHandler);
router.post("/cours/:coursId/modules", requireAuth, createModuleHandler);

router.get("/modules/:id", getModuleHandler);
router.patch("/modules/:id", requireAuth, updateModuleHandler);
router.delete("/modules/:id", requireAuth, deleteModuleHandler);

export default router;

