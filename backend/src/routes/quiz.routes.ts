import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth";
import {
  getQuizHandler,
  getQuizFullHandler,
  submitQuizHandler,
  listQuizzesForModuleHandler,
  createQuizHandler,
  updateQuizHandler,
  deleteQuizHandler,
  listQuestionsForQuizHandler,
  createQuestionHandler,
  updateQuestionHandler,
  deleteQuestionHandler,
  listOptionsForQuestionHandler,
  createOptionHandler,
  updateOptionHandler,
  deleteOptionHandler,
  listReponsesForQuestionHandler,
  createReponseHandler,
  updateReponseHandler,
  deleteReponseHandler,
} from "../controllers/quiz.controller";

const router = Router();

router.get("/quizzes/:id", getQuizHandler);
router.get("/quizzes/:id/full", requireAuth, requireRole("Admin", "Mentor"), getQuizFullHandler);
router.post("/quizzes/:id/submit", requireAuth, requireRole("Apprenant"), submitQuizHandler);

// Management routes (Admin/Mentor)
router.get("/modules/:moduleId/quizzes", listQuizzesForModuleHandler);
router.post("/modules/:moduleId/quizzes", requireAuth, requireRole("Admin", "Mentor"), createQuizHandler);
router.patch("/quizzes/:id", requireAuth, requireRole("Admin", "Mentor"), updateQuizHandler);
router.delete("/quizzes/:id", requireAuth, requireRole("Admin", "Mentor"), deleteQuizHandler);

router.get("/quizzes/:quizId/questions", listQuestionsForQuizHandler);
router.post("/quizzes/:quizId/questions", requireAuth, requireRole("Admin", "Mentor"), createQuestionHandler);
router.patch("/questions/:id", requireAuth, requireRole("Admin", "Mentor"), updateQuestionHandler);
router.delete("/questions/:id", requireAuth, requireRole("Admin", "Mentor"), deleteQuestionHandler);

router.get("/questions/:questionId/options", listOptionsForQuestionHandler);
router.post("/questions/:questionId/options", requireAuth, requireRole("Admin", "Mentor"), createOptionHandler);
router.patch("/options/:id", requireAuth, requireRole("Admin", "Mentor"), updateOptionHandler);
router.delete("/options/:id", requireAuth, requireRole("Admin", "Mentor"), deleteOptionHandler);

router.get("/questions/:questionId/reponses", listReponsesForQuestionHandler);
router.post("/questions/:questionId/reponses", requireAuth, requireRole("Admin", "Mentor"), createReponseHandler);
router.patch("/reponses/:id", requireAuth, requireRole("Admin", "Mentor"), updateReponseHandler);
router.delete("/reponses/:id", requireAuth, requireRole("Admin", "Mentor"), deleteReponseHandler);

export default router;
