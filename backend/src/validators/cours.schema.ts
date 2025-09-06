import { z } from "zod";

export const createCoursSchema = z.object({
  titre: z.string().min(1),
  description: z.string().min(1),
  duree: z.number().int().positive(),
  status: z.string().min(1),
  imageUrl: z.string().url().or(z.string().min(1)),
  mentorId: z.number().int().positive().optional(), // requis si admin
});

export type CreateCoursInput = z.infer<typeof createCoursSchema>;

export const updateCoursSchema = createCoursSchema.partial();

export type UpdateCoursInput = z.infer<typeof updateCoursSchema>;

