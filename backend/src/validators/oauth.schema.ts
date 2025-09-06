import { z } from "zod";

export const oauthSchema = z.object({
  provider: z.string().min(1),
  providerAccountId: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  photoUrl: z.string().url().optional(),
});

export type OAuthInput = z.infer<typeof oauthSchema>;

