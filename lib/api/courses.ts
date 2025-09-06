import { safeJsonFetch } from "../http";
import { coursSchema, moduleSchema, paginated } from "../schemas";
import type { Cours, Paginated, Module } from "../types";

export async function listCours(params?: { page?: number; pageSize?: number }) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.pageSize) search.set("pageSize", String(params.pageSize));
  const qs = search.toString();
  return safeJsonFetch<Paginated<Cours>>(`/api/v1/cours${qs ? `?${qs}` : ""}`, { schema: paginated(coursSchema) });
}

export async function getCours(id: number) {
  return safeJsonFetch<Cours>(`/api/v1/cours/${id}`, { schema: coursSchema });
}

export async function listModulesForCours(coursId: number) {
  return safeJsonFetch<Module[]>(`/api/v1/cours/${coursId}/modules`, { schema: moduleSchema.array() });
}
