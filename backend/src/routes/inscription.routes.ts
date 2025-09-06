import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { enrollHandler, listMyInscriptionsHandler, updateProgressionHandler } from "../controllers/inscription.controller";

const router = Router();

router.post("/cours/:coursId/enroll", requireAuth, requireRole("Apprenant"), enrollHandler);
router.get("/me/inscriptions", requireAuth, requireRole("Apprenant"), listMyInscriptionsHandler);
router.patch("/inscriptions/:id/progression", requireAuth, requireRole("Apprenant"), updateProgressionHandler);

export default router;

