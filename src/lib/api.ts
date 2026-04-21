// Lightweight fetch-based API client for the Ledger Pro backend.
// Reads base URL from VITE_API_URL (falls back to http://localhost:5010).

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:5010";

const TOKEN_KEY = "ledgerpro.token";
const USER_KEY = "ledgerpro.user";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
};

export type Business = {
  id: number;
  userId: number;
  name: string;
  ntn: string;
  address: string;
  province: string;
  fbrToken: string;
  posId: string | null;
  isFbrEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const tokenStore = {
  get: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
  setUser: (u: AuthUser) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const h = new Headers(headers);
  if (!h.has("Content-Type") && rest.body) h.set("Content-Type", "application/json");
  if (auth) {
    const token = tokenStore.get();
    if (token) h.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...rest, headers: h });
  } catch (e) {
    throw new ApiError(
      `Cannot reach API at ${BASE_URL}. Is the server running?`,
      0,
      e,
    );
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : null) ?? `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }
  return data as T;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ message: string; user?: AuthUser; token?: string }>(
      "/api/v1/register",
      { method: "POST", body: JSON.stringify({ email, password }), auth: false },
    ),
  login: (email: string, password: string) =>
    request<{ message: string; token: string; user: AuthUser }>("/api/v1/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    }),
  getBusiness: () =>
    request<{ success: boolean; data: Business | null }>("/api/v1/businesses"),
  createBusiness: (payload: {
    name: string;
    ntn: string;
    address: string;
    province: string;
    fbrToken: string;
    posId?: string;
  }) =>
    request<{ success: boolean; data: Business }>("/api/v1/businesses", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const PK_PROVINCES = [
  "Sindh",
  "Punjab",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu and Kashmir",
] as const;
