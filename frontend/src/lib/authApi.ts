import type { AuthUser } from "@/types/auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const AUTH_TOKEN_KEY = "neurohaven_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function clearStoredToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  return res.json();
}

export async function authPost<TBody extends object>(
  path: string,
  body: TBody,
  withAuthHeader: boolean
): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (withAuthHeader) {
    const t = getStoredToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  return fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_BASE}${path}`, { ...init, headers });
}
