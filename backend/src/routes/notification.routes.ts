import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { listMyNotificationsHandler, markNotificationReadHandler } from "../controllers/notification.controller";

const router = Router();

router.get("/notifications", requireAuth, listMyNotificationsHandler);
router.patch("/notifications/:id/read", requireAuth, markNotificationReadHandler);

export default router;

