/**
 * ReturnGuard API Client Config & Base Fetcher
 *
 * Configurable via:
 * - VITE_RETURNGUARD_API_BASE_URL (defaults to empty/relative)
 * - VITE_USE_MOCK_API ("true" | "false")
 */

const API_BASE_URL = import.meta.env.VITE_RETURNGUARD_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_RETURNGUARD_API_BASE_URL;

export const config = {
  apiBaseUrl: API_BASE_URL,
  useMock: USE_MOCK
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.apiBaseUrl}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new ApiError(
      `API error ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  return (await response.json()) as T;
}

/** Stable provider primitives used by endpoint modules in either transport mode. */
export const realApiClient = {
  request: apiFetch
};

export const mockApiClient = {
  async respond<T>(data: T, delayMs = 80): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return data;
  }
};
