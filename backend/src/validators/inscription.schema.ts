import { z } from "zod";

export const enrollSchema = z.object({
  // placeholder if we add options later
});

export const updateProgressSchema = z.object({
  progression: z.number().int().min(0).max(100),
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;

