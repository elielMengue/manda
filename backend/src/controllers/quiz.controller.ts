import type { Request, Response, NextFunction } from "express";
import {
  getQuizDeepService,
  getQuizPublicService,
  submitQuizService,
  listQuizzesForModuleService,
  createQuizService,
  updateQuizService,
  deleteQuizService,
  listQuestionsForQuizService,
  createQuestionService,
  updateQuestionService,
  deleteQuestionService,
  listOptionsForQuestionService,
  createOptionService,
  updateOptionService,
  deleteOptionService,
  listReponsesForQuestionService,
  createReponseService,
  updateReponseService,
  deleteReponseService,
} from "../services/quiz.service";
import { HttpError } from "../middlewares/error";
import {
  submitQuizSchema,
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  createOptionSchema,
  updateOptionSchema,
  createReponseSchema,
  updateReponseSchema,
} from "../validators/quiz.schema";

export async function getQuizHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const quiz = await getQuizPublicService(id);
    res.json(quiz);
  } catch (err) { next(err); }
}

export async function getQuizFullHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const quiz = await getQuizDeepService(id);
    res.json(quiz);
  } catch (err) { next(err); }
}

export async function submitQuizHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = submitQuizSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const out = await submitQuizService(req.user.id, id, parsed.data);
    res.json(out);
  } catch (err) { next(err); }
}

// Management handlers
export async function listQuizzesForModuleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const moduleId = Number(req.params.moduleId);
    if (!moduleId) throw new HttpError(400, "moduleId invalide");
    const items = await listQuizzesForModuleService(moduleId);
    res.json(items);
  } catch (err) { next(err); }
}

export async function createQuizHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const moduleId = Number(req.params.moduleId);
    if (!moduleId) throw new HttpError(400, "moduleId invalide");
    const parsed = createQuizSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const created = await createQuizService(moduleId, parsed.data, req.user);
    res.status(201).json(created);
  } catch (err) { next(err); }
}

export async function updateQuizHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateQuizSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const updated = await updateQuizService(id, parsed.data, req.user);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function deleteQuizHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const out = await deleteQuizService(id, req.user);
    res.json(out);
  } catch (err) { next(err); }
}

export async function listQuestionsForQuizHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const quizId = Number(req.params.quizId);
    if (!quizId) throw new HttpError(400, "quizId invalide");
    const items = await listQuestionsForQuizService(quizId);
    res.json(items);
  } catch (err) { next(err); }
}

export async function createQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const quizId = Number(req.params.quizId);
    if (!quizId) throw new HttpError(400, "quizId invalide");
    const parsed = createQuestionSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const created = await createQuestionService(quizId, parsed.data, req.user);
    res.status(201).json(created);
  } catch (err) { next(err); }
}

export async function updateQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateQuestionSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const updated = await updateQuestionService(id, parsed.data, req.user);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function deleteQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const out = await deleteQuestionService(id, req.user);
    res.json(out);
  } catch (err) { next(err); }
}

export async function listOptionsForQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const questionId = Number(req.params.questionId);
    if (!questionId) throw new HttpError(400, "questionId invalide");
    const items = await listOptionsForQuestionService(questionId);
    res.json(items);
  } catch (err) { next(err); }
}

export async function createOptionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const questionId = Number(req.params.questionId);
    if (!questionId) throw new HttpError(400, "questionId invalide");
    const parsed = createOptionSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const created = await createOptionService(questionId, parsed.data, req.user);
    res.status(201).json(created);
  } catch (err) { next(err); }
}

export async function updateOptionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateOptionSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const updated = await updateOptionService(id, parsed.data, req.user);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function deleteOptionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const out = await deleteOptionService(id, req.user);
    res.json(out);
  } catch (err) { next(err); }
}

export async function listReponsesForQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const questionId = Number(req.params.questionId);
    if (!questionId) throw new HttpError(400, "questionId invalide");
    const items = await listReponsesForQuestionService(questionId);
    res.json(items);
  } catch (err) { next(err); }
}

export async function createReponseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const questionId = Number(req.params.questionId);
    if (!questionId) throw new HttpError(400, "questionId invalide");
    const parsed = createReponseSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const created = await createReponseService(questionId, parsed.data, req.user);
    res.status(201).json(created);
  } catch (err) { next(err); }
}

export async function updateReponseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const parsed = updateReponseSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, parsed.error.message);
    const updated = await updateReponseService(id, parsed.data, req.user);
    res.json(updated);
  } catch (err) { next(err); }
}

export async function deleteReponseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Non authentifié");
    const id = Number(req.params.id);
    if (!id) throw new HttpError(400, "id invalide");
    const out = await deleteReponseService(id, req.user);
    res.json(out);
  } catch (err) { next(err); }
}
