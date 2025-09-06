import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  phone: z.string().min(3).optional(),
  photoUrl: z.string().url().or(z.string().min(1)).optional(),
  status: z.boolean().optional(),
  role: z.enum(["Admin", "Apprenant", "Mentor", "Partenaire"]).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

