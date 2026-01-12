export interface RequestInitEx extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

const API_URL = 'https://localhost:7120';

async function request<T>(
  url: string,
  options?: RequestInitEx
): Promise<T> {
  let fullUrl = API_URL + url;

  if (options?.params) {
    const qs = Object.entries(options.params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join('&');

    if (qs) fullUrl += `?${qs}`;
  }

  const res = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const http = {
  get: <T>(url: string, params?: RequestInitEx['params']) =>
    request<T>(url, { method: 'GET', params }),

  post: <T>(url: string, body?: unknown, params?: RequestInitEx['params']) =>
    request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),

  put: <T>(url: string, body?: unknown, params?: RequestInitEx['params']) =>
    request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),

  patch: <T>(url: string, body?: unknown, params?: RequestInitEx['params']) =>
    request<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),

  delete: <T>(url: string, params?: RequestInitEx['params']) =>
    request<T>(url, { method: 'DELETE', params }),
};
