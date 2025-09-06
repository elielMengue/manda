import { safeJsonFetch } from "../http";
import { lessonSchema } from "../schemas";
import type { Lesson } from "../types";

export async function getLesson(id: number) {
  return safeJsonFetch<Lesson>(`/api/v1/lessons/${id}`, { schema: lessonSchema });
}
