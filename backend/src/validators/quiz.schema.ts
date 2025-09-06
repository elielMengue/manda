import { z } from "zod";

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number().int().positive(),
      // pour QCM: optionIds; pour texte: reponseText
      optionIds: z.array(z.number().int().positive()).optional(),
      reponseText: z.string().optional(),
    })
  ),
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;

export const createQuizSchema = z.object({
  titre: z.string().min(1),
  description: z.string().min(1),
  dureeMax: z.number().int().positive(),
  nombreTentatives: z.number().int().min(1).max(10),
  scoreMinReussite: z.number().int().min(0),
  type: z.string().min(1),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const updateQuizSchema = createQuizSchema.partial();
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;

export const createQuestionSchema = z.object({
  questionText: z.string().min(1),
  ordre: z.number().int().nonnegative(),
  points: z.number().int().positive().default(1),
  typeQuestion: z.string().min(1),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = createQuestionSchema.partial();
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export const createOptionSchema = z.object({
  optionText: z.string().min(1),
  isCorrect: z.boolean().default(false),
});

export type CreateOptionInput = z.infer<typeof createOptionSchema>;

export const updateOptionSchema = createOptionSchema.partial();
export type UpdateOptionInput = z.infer<typeof updateOptionSchema>;

export const createReponseSchema = z.object({
  reponseText: z.string().min(1),
  isCorrect: z.boolean().default(true),
});

export type CreateReponseInput = z.infer<typeof createReponseSchema>;

export const updateReponseSchema = createReponseSchema.partial();
export type UpdateReponseInput = z.infer<typeof updateReponseSchema>;
