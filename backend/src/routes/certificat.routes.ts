import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { certificatePdfHandler, issueCertificateHandler } from "../controllers/certificat.controller";

const router = Router();

router.post("/certificats/issue", requireAuth, requireRole("Admin", "Mentor"), issueCertificateHandler);
router.get("/certificats/:id/pdf", certificatePdfHandler);

export default router;

