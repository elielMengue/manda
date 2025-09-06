import { z } from "zod";

export class ApiError extends Error {
  status: number;
  info?: unknown;
  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
}

type FetchOptions = Omit<RequestInit, "body"> & {
  token?: string | null;
  body?: unknown;
};

export async function jsonFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> | undefined || {}),
  };

  if (opts.body !== undefined && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  if (opts.token) {
    headers["Authorization"] = `Bearer ${opts.token}`;
  }

  const res = await fetch(url, {
    ...opts,
    headers,
    body: opts.body instanceof FormData ? opts.body : opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: opts.cache ?? "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => undefined) : await res.text();

  if (!res.ok) {
    const message = isJson && data && (data.message || data.error) ? (data.message || data.error) : `HTTP ${res.status}`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export async function safeJsonFetch<T>(path: string, opts: FetchOptions & { schema: z.ZodType<T> }): Promise<T> {
  const data = await jsonFetch<unknown>(path, opts);
  const parsed = opts.schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("Invalid response shape", 500, parsed.error.format());
  }
  return parsed.data as T;
}
