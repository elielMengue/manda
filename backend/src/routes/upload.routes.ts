import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

// Video upload
const uploadVideosRoot = path.join(process.cwd(), "uploads", "videos");
try { fs.mkdirSync(uploadVideosRoot, { recursive: true }); } catch {}
const storageVideo = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadVideosRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".mp4";
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});
const uploadVideo = multer({ storage: storageVideo, limits: { fileSize: 500 * 1024 * 1024 } });

// Upload a video file (Mentor/Admin)
router.post("/uploads/video", requireAuth, requireRole("Mentor", "Admin"), uploadVideo.single("video"), (req, res) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "Fichier manquant (champ 'video')" });
  const relative = `/uploads/videos/${file.filename}`;
  res.status(201).json({ url: relative, filename: file.originalname, size: file.size, mime: file.mimetype });
});

// Image upload (avatar, etc.)
const uploadImagesRoot = path.join(process.cwd(), "uploads", "images");
try { fs.mkdirSync(uploadImagesRoot, { recursive: true }); } catch {}
const storageImage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadImagesRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});
const uploadImage = multer({
  storage: storageImage,
  fileFilter: (_req, file, cb) => {
    if ((file.mimetype || "").startsWith("image/")) return cb(null, true);
    cb(new Error("Type de fichier non supporté"));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post("/uploads/image", requireAuth, requireRole("Admin", "Mentor", "Apprenant", "Partenaire"), uploadImage.single("image"), (req, res) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "Fichier manquant (champ 'image')" });
  const relative = `/uploads/images/${file.filename}`;
  res.status(201).json({ url: relative, filename: file.originalname, size: file.size, mime: file.mimetype });
});

export default router;
