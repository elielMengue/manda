import { Router } from "express";
import authRoutes from "./auth.routes";
import coursRoutes from "./cours.routes";
import moduleRoutes from "./module.routes";
import lessonRoutes from "./lesson.routes";
import userRoutes from "./user.routes";
import inscriptionRoutes from "./inscription.routes";
import quizRoutes from "./quiz.routes";
import notificationRoutes from "./notification.routes";
import messageRoutes from "./message.routes";
import postRoutes from "./post.routes";
import certificatRoutes from "./certificat.routes";
import profileRoutes from "./profile.routes";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cours", coursRoutes);
router.use("/", moduleRoutes);
router.use("/", lessonRoutes);
router.use("/", userRoutes);
router.use("/", inscriptionRoutes);
router.use("/", quizRoutes);
router.use("/", notificationRoutes);
router.use("/", messageRoutes);
router.use("/", postRoutes);
router.use("/", certificatRoutes);
router.use("/", profileRoutes);

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
