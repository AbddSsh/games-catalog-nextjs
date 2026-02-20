import { ENV } from "@/shared/config";
import type { IApiError } from "@/shared/types";

export interface IFetchOptions extends Omit<RequestInit, "method" | "body"> {
  locale?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface IApiClientConfig {
  baseUrl: string;
  defaultHeaders: Record<string, string>;
}

const DEFAULT_CONFIG: IApiClientConfig = {
  baseUrl: ENV.API_BASE_URL,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

/**
 * Build URL with query parameters
 */
function buildUrl(
  endpoint: string,
  locale?: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const baseUrl = endpoint.startsWith("http")
    ? endpoint
    : `${DEFAULT_CONFIG.baseUrl}${endpoint}`;

  const url = new URL(baseUrl);

  // Always add locale if provided
  if (locale) {
    url.searchParams.set("locale", locale);
  }

  // Add additional params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Handle API errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: IApiError = await response.json().catch(() => ({
      statusCode: response.status,
      message: response.statusText,
      error: "Unknown error",
    }));
    throw new Error(
      `API Error ${errorData.statusCode}: ${errorData.message}`
    );
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

/**
 * API GET request
 * Locale is passed as ?locale= query parameter
 */
export async function apiGet<T>(
  endpoint: string,
  options: IFetchOptions = {}
): Promise<T> {
  const { locale, params, ...fetchOptions } = options;

  const url = buildUrl(endpoint, locale, params);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд таймаут

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      method: "GET",
      headers: {
        ...DEFAULT_CONFIG.defaultHeaders,
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * API POST request
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  options: IFetchOptions = {}
): Promise<T> {
  const { locale, params, ...fetchOptions } = options;

  const url = buildUrl(endpoint, locale, params);

  const response = await fetch(url, {
    ...fetchOptions,
    method: "POST",
    headers: {
      ...DEFAULT_CONFIG.defaultHeaders,
      ...fetchOptions.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  return handleResponse<T>(response);
}

/**
 * Generic API client (for custom methods)
 */
export async function apiClient<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  options: IFetchOptions & { body?: unknown } = {}
): Promise<T> {
  const { locale, params, body, ...fetchOptions } = options;

  const url = buildUrl(endpoint, locale, params);

  const response = await fetch(url, {
    ...fetchOptions,
    method,
    headers: {
      ...DEFAULT_CONFIG.defaultHeaders,
      ...fetchOptions.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}
