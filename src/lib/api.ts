import axios from "axios";

export const AUTH_TOKEN_KEY = "imagine.auth.token";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "https://robotics-api.imagine.io";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export type ApiUser = {
  id?: number | string;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

export async function fetchCurrentUser(): Promise<ApiUser | null> {
  const { data } = await api.get("/accounts/users/");
  if (Array.isArray(data)) return (data[0] as ApiUser) ?? null;
  if (data && typeof data === "object" && "results" in data && Array.isArray((data as { results: ApiUser[] }).results)) {
    return (data as { results: ApiUser[] }).results[0] ?? null;
  }
  return (data as ApiUser) ?? null;
}
