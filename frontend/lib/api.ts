const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: Record<string, string[]> = {}
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** First message for a field, for rendering under an input. */
  fieldError(field: string): string | undefined {
    return this.errors[field]?.[0];
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

/**
 * Held in memory rather than read from storage per request, so the one place
 * that owns the session (AuthProvider) decides what the client sends.
 */
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  // FormData carries its own multipart boundary, so the browser must set
  // Content-Type itself — naming it here would omit the boundary and the
  // request would arrive with no parsable fields.
  const estFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && !estFormData && { "Content-Type": "application/json" }),
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...headers,
    },
    ...(body !== undefined && { body: estFormData ? body : JSON.stringify(body) }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `Erreur ${response.status}`,
      response.status,
      payload?.errors ?? {}
    );
  }

  return payload as T;
}

/**
 * Downloads a file from an authenticated endpoint.
 *
 * A plain <a href> cannot carry the bearer token, so the bytes are fetched
 * with it and handed to the browser as a blob. The object URL is revoked
 * straight after to avoid leaking it for the life of the page.
 */
export async function telecharger(path: string, nomFichier: string): Promise<void> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/octet-stream",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);

    throw new ApiError(
      payload?.message ?? `Erreur ${response.status}`,
      response.status,
      payload?.errors ?? {}
    );
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  try {
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichier;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
