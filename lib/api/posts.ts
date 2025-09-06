import { safeJsonFetch } from "../http";
import { z } from "zod";

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  datePublication: z.string(),
  dateExpiration: z.string(),
  imageUrl: z.string(),
  typeOportunite: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  partenaireId: z.number(),
  userId: z.number(),
});

export type Post = z.infer<typeof postSchema>;

export async function listPosts() {
  return safeJsonFetch<Post[]>(`/api/v1/posts`, { schema: postSchema.array() });
}

export async function createPost(token: string, body: { title: string; content: string; dateExpiration: string; imageUrl?: string; typeOportunite: string; status: string }) {
  return safeJsonFetch<Post>(`/api/v1/posts`, { method: 'POST', token, body, schema: postSchema });
}

