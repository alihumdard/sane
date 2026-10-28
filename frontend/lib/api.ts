/**
 * Where the browser calls the API.
 *
 * Relative by default, so the call goes back to whichever host served the
 * page: nginx proxies /api on the same host, and the site then works under
 * its IP, under a test hostname and under a real domain without a rebuild.
 * It was pinned to one address, so a page served from anywhere else called
 * across to that address — a different origin, with its own certificate.
 *
 * NEXT_PUBLIC_API_URL still overrides it, for a front-end served apart from
 * its API.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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

  /**
   * Every validation message, not just the first. Laravel's `message` only
   * carries one and appends "(et N erreurs en plus)", which hides the rest
   * from a form that shows a single line.
   */
  allErrors(): string {
    const messages = Object.values(this.errors).flat();

    return messages.length > 0 ? messages.join(" ") : this.message;
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

/**
 * Called when the server rejects the token we hold.
 *
 * A session can end between two clicks — the token expires, or is revoked
 * elsewhere. Without this, every page keeps its stale `user` and simply shows
 * "Authentification requise" on each request, leaving the visitor signed in as
 * far as the interface is concerned and with nothing to click to recover.
 * AuthProvider registers the handler that clears the session.
 */
let surSessionExpiree: (() => void) | null = null;

export function setSessionExpireeHandler(handler: (() => void) | null) {
  surSessionExpiree = handler;
}

/**
 * Turns a failed response into an ApiError, ending the local session first
 * when the server rejected the token we were holding.
 */
function erreurDepuis(
  response: Response,
  payload: { message?: string; errors?: Record<string, string[]> } | null
): ApiError {
  // Only when we actually sent a token: a 401 on a public page just means the
  // caller is not signed in, which is not a session to end.
  if (response.status === 401 && authToken) surSessionExpiree?.();

  return new ApiError(
    payload?.message ?? `Erreur ${response.status}`,
    response.status,
    payload?.errors ?? {}
  );
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

  if (!response.ok) throw erreurDepuis(response, payload);

  return payload as T;
}

/**
 * Multipart upload. Deliberately does not set Content-Type: the browser has to
 * generate it, because only it knows the multipart boundary.
 */
async function upload<T>(path: string, body: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) throw erreurDepuis(response, payload);

  return payload as T;
}

/**
 * Fetches a protected file as a blob. Takes an absolute URL, since the API
 * hands these back already built, and goes through fetch rather than a link
 * because the endpoint requires the bearer token.
 */
async function download(url: string): Promise<Blob> {
  const response = await fetch(url, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  if (!response.ok) {
    throw new ApiError(`Téléchargement impossible (${response.status})`, response.status);
  }

  return response.blob();
}

/**
 * Downloads a file from an authenticated endpoint and hands it to the browser.
 *
 * Takes an API path rather than an absolute URL, and saves the result itself:
 * a plain <a href> cannot carry the bearer token. The object URL is revoked
 * straight after so it does not leak for the life of the page.
 */
export async function telecharger(path: string, nomFichier: string): Promise<void> {
  const blob = await download(`${BASE_URL}${path}`);
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
  upload,
  download,
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
