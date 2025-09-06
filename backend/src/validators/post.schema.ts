import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  dateExpiration: z.coerce.date(),
  imageUrl: z.string().url().optional(),
  typeOportunite: z.string().min(1),
  status: z.string().min(1),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial();
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

