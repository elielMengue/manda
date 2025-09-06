import { safeJsonFetch } from "../http";
import { quizSchema, quizSummarySchema, quizSubmitResultSchema } from "../schemas";
import { z } from "zod";

export type QuizOption = { id: number; optionText: string; isCorrect?: boolean };
export type QuizQuestion = {
  id: number;
  questionText: string;
  ordre: number;
  points?: number;
  typeQuestion: string;
  options: QuizOption[];
};
export type Quiz = {
  id: number;
  titre: string;
  description: string;
  dureeMax: number;
  nombreTentatives: number;
  scoreMinReussite: number;
  type: string;
  moduleId: number;
  questions: QuizQuestion[];
};

export async function listQuizzesForModule(moduleId: number) {
  return safeJsonFetch<Array<Omit<Quiz, "questions">>>(`/api/v1/modules/${moduleId}/quizzes`, { schema: quizSummarySchema.array() });
}

export async function getQuiz(id: number) {
  return safeJsonFetch<Quiz>(`/api/v1/quizzes/${id}`, { schema: quizSchema });
}

export async function submitQuiz(id: number, token: string, answers: Array<{ questionId: number; optionIds?: number[]; reponseText?: string }>) {
  return safeJsonFetch<{ attemptId: number; score: number }>(`/api/v1/quizzes/${id}/submit`, {
    method: "POST",
    token,
    body: { answers },
    schema: quizSubmitResultSchema,
  });
}

export async function createQuiz(moduleId: number, token: string, body: unknown) {
  return safeJsonFetch<unknown>(`/api/v1/modules/${moduleId}/quizzes`, { method: 'POST', token, body, schema: z.unknown() });
}

export async function createQuestion(quizId: number, token: string, body: unknown) {
  return safeJsonFetch<unknown>(`/api/v1/quizzes/${quizId}/questions`, { method: 'POST', token, body, schema: z.unknown() });
}

export async function createOption(questionId: number, token: string, body: unknown) {
  return safeJsonFetch<unknown>(`/api/v1/questions/${questionId}/options`, { method: 'POST', token, body, schema: z.unknown() });
}

export async function createReponse(questionId: number, token: string, body: unknown) {
  return safeJsonFetch<unknown>(`/api/v1/questions/${questionId}/reponses`, { method: 'POST', token, body, schema: z.unknown() });
}

export async function getQuizFull(id: number, token: string) {
  return safeJsonFetch<Quiz>(`/api/v1/quizzes/${id}/full`, { token, schema: quizSchema });
}
