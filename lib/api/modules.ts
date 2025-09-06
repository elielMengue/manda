import { safeJsonFetch } from "../http";
import { lessonSchema, moduleSchema } from "../schemas";
import type { Lesson, Module } from "../types";

export async function getModule(id: number) {
  return safeJsonFetch<Module>(`/api/v1/modules/${id}`, { schema: moduleSchema });
}

export async function listLessonsForModule(moduleId: number) {
  return safeJsonFetch<Lesson[]>(`/api/v1/modules/${moduleId}/lessons`, { schema: lessonSchema.array() });
}
