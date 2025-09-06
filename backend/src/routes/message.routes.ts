import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getConversationHandler, listConversationsHandler, sendMessageHandler } from "../controllers/message.controller";

const router = Router();

router.post("/messages", requireAuth, sendMessageHandler);
router.get("/messages/conversations", requireAuth, listConversationsHandler);
router.get("/messages/conversation/:userId", requireAuth, getConversationHandler);

export default router;

