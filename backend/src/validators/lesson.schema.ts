import { z } from "zod";

export const createLessonSchema = z.object({
  titre: z.string().min(1),
  textContenu: z.string().min(1),
  duree: z.number().int().positive(),
  type: z.string().min(1),
  ordre: z.number().int().nonnegative(),
  videoUrl: z.string().url().or(z.string().min(1)),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = createLessonSchema.partial();
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;

