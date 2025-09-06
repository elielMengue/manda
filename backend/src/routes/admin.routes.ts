import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { bootstrapAdminHandler, devAdminLoginHandler, exportUsersCsvHandler, getAdminMetricsHandler, notifyUsersHandler, resetUserPasswordHandler, adminSendMessagesHandler } from "../controllers/admin.controller";

const router = Router();

router.get("/admin/metrics", requireAuth, requireRole("Admin"), getAdminMetricsHandler);
router.post("/admin/notify", requireAuth, requireRole("Admin"), notifyUsersHandler);
router.post("/admin/users/:id/reset-password", requireAuth, requireRole("Admin"), resetUserPasswordHandler);
router.get("/admin/users/export", requireAuth, requireRole("Admin"), exportUsersCsvHandler);
// bootstrap routes (protected by header x-admin-setup)
router.post("/admin/bootstrap", bootstrapAdminHandler);
router.post("/admin/dev-login", devAdminLoginHandler);
// admin messaging
router.post("/admin/messages", requireAuth, requireRole("Admin"), adminSendMessagesHandler);

export default router;
