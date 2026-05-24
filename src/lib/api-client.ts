/**
 * Lightweight fetch-based REST API client for the SubmitLog NestJS backend.
 *
 * - Reads base URL from `import.meta.env.VITE_API_BASE_URL`.
 * - Attaches `Authorization: Bearer <token>` from `localStorage('sl_access_token')`.
 * - On 401, attempts a single token refresh via `POST /auth/refresh` using
 *   `localStorage('sl_refresh_token')`, then retries the original request once.
 * - On refresh failure, clears tokens and redirects to `/login`.
 */

const BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

const ACCESS_TOKEN_KEY = "sl_access_token";
const REFRESH_TOKEN_KEY = "sl_refresh_token";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions extends Omit<RequestInit, "method" | "body"> {
  /** Query string params; values are coerced to strings. `undefined`/`null` are skipped. */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** JSON body — serialized automatically. For FormData/Blob, use `rawBody`. */
  body?: unknown;
  /** Raw body passthrough (FormData, Blob, string). Skips JSON serialization. */
  rawBody?: BodyInit;
  /** Skip auth header even if a token exists. */
  skipAuth?: boolean;
  /** Internal: prevents infinite refresh loops. */
  _retried?: boolean;
}

export class ApiError<T = unknown> extends Error {
  status: number;
  data: T | undefined;

  constructor(message: string, status: number, data?: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// ---------- token helpers ----------

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getAccessToken(): string | null {
  return isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
}

export function getRefreshToken(): string | null {
  return isBrowser() ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
}

export function setTokens(access: string, refresh?: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ---------- refresh flow ----------

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;
      const data = (await res.json().catch(() => null)) as
        | { accessToken?: string; refreshToken?: string }
        | null;
      if (!data?.accessToken) return null;
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function redirectToLogin(): void {
  if (!isBrowser()) return;
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// ---------- core request ----------

function buildUrl(path: string, query?: ApiRequestOptions["query"]): string {
  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.append(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${url}${url.includes("?") ? "&" : "?"}${qs}` : url;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { query, body, rawBody, skipAuth, _retried, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  let finalBody: BodyInit | undefined;

  if (rawBody !== undefined) {
    finalBody = rawBody;
  } else if (body !== undefined) {
    finalBody = JSON.stringify(body);
    if (!finalHeaders.has("Content-Type")) {
      finalHeaders.set("Content-Type", "application/json");
    }
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(buildUrl(path, query), {
    ...rest,
    method,
    headers: finalHeaders,
    body: finalBody,
  });

  if (res.status === 401 && !skipAuth && !_retried) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(method, path, { ...options, _retried: true });
    }
    clearTokens();
    redirectToLogin();
    throw new ApiError("Unauthorized", 401);
  }

  const text = await res.text();
  const data: unknown = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })()
    : undefined;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : null) ||
      res.statusText ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

// ---------- public API ----------

export const apiClient = {
  get: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    request<T>("GET", path, options),
  post: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  put: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>("PUT", path, { ...options, body }),
  patch: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    request<T>("DELETE", path, options),
};

export default apiClient;
