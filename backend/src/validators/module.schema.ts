import { z } from "zod";

export const createModuleSchema = z.object({
  titre: z.string().min(1),
  description: z.string().min(1),
  ordre: z.number().int().nonnegative(),
  duree: z.number().int().positive(),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;

export const updateModuleSchema = createModuleSchema.partial();

export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

