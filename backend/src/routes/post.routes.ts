import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import { createPostHandler, deletePostHandler, getPostHandler, listPostsHandler, updatePostHandler } from "../controllers/post.controller";

const router = Router();

router.get("/posts", listPostsHandler);
router.get("/posts/:id", getPostHandler);
router.post("/posts", requireAuth, requireRole("Partenaire", "Admin"), createPostHandler);
router.patch("/posts/:id", requireAuth, requireRole("Partenaire", "Admin"), updatePostHandler);
router.delete("/posts/:id", requireAuth, requireRole("Partenaire", "Admin"), deletePostHandler);

export default router;
