import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { migrateAccessTierStorage, readAccessTier, writeAccessTier, type AccessTier } from "@/lib/access";
import { fetchCurrentUser, getAuthToken, setAuthToken, type ApiUser } from "@/lib/api";

const STORAGE_KEY = "imagine.auth.session";
const SIGNED_OUT_KEY = "imagine.auth.signedOut";
const URL_TOKEN_PARAM = "token";

const DEMO_USER: AuthUser = {
  email: "demo@imagine.io",
  name: "Demo User",
  orgLabel: "imagine.io",
};

export type AuthUser = {
  email: string;
  name: string;
  orgLabel: string;
  role?: string;
};

function readStoredUser(): AuthUser | null {
  try {
    if (localStorage.getItem(SIGNED_OUT_KEY) === "1") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthUser;
      if (!parsed?.email || !parsed?.name) return null;
      // Keep demo sessions aligned with current default profile copy.
      if (parsed.email === DEMO_USER.email && parsed.name !== DEMO_USER.name) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
        return DEMO_USER;
      }
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    return DEMO_USER;
  } catch {
    return DEMO_USER;
  }
}

function writeStoredUser(user: AuthUser | null) {
  if (user) {
    localStorage.removeItem(SIGNED_OUT_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(SIGNED_OUT_KEY, "1");
  }
}

let memoryUser: AuthUser | null = readStoredUser();
let userFetchStarted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): AuthUser | null {
  return memoryUser;
}

function getServerSnapshot(): AuthUser | null {
  return null;
}

function setUserInternal(user: AuthUser | null) {
  memoryUser = user;
  writeStoredUser(user);
  emit();
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function displayNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "User";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function apiUserToAuthUser(apiUser: ApiUser): AuthUser {
  const fullName = [apiUser.first_name, apiUser.last_name].filter(Boolean).join(" ").trim();
  return {
    email: apiUser.email ?? "",
    name: apiUser.username || fullName || apiUser.email || "User",
    orgLabel: apiUser.company_name || "-",
    role: apiUser.role || "-",
  };
}

function consumeTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(window.location.href);
    const token = url.searchParams.get(URL_TOKEN_PARAM);
    if (!token) return null;
    url.searchParams.delete(URL_TOKEN_PARAM);
    const nextSearch = url.searchParams.toString();
    const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ""}${url.hash}`;
    window.history.replaceState({}, "", nextUrl);
    return token;
  } catch {
    return null;
  }
}

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Explore vs Full (batch queue, exports, API keys). */
  accessTier: AccessTier;
  setAccessTier: (tier: AccessTier) => void;
  signIn: (email: string, password: string) => Promise<void>;
  /** One-click demo return after sign-out (showcase flow). */
  restoreSession: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [accessTier, setAccessTierState] = useState<AccessTier>(() => {
    migrateAccessTierStorage();
    return readAccessTier();
  });

  useEffect(() => {
    const urlToken = consumeTokenFromUrl();
    if (urlToken) setAuthToken(urlToken);

    const token = getAuthToken();
    if (!token) return;
    if (userFetchStarted) return;
    userFetchStarted = true;

    fetchCurrentUser()
      .then((apiUser) => {
        if (!apiUser) return;
        setUserInternal(apiUserToAuthUser(apiUser));
      })
      .catch(() => {
        setAuthToken(null);
        userFetchStarted = false;
      });
  }, []);

  const setAccessTier = useCallback((tier: AccessTier) => {
    writeAccessTier(tier);
    setAccessTierState(tier);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const trimmed = email.trim().toLowerCase();
    await delay(350);
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new Error("Enter a valid email address.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const next: AuthUser = {
      email: trimmed,
      name: displayNameFromEmail(trimmed),
      orgLabel: "imagine.io",
    };
    setUserInternal(next);
  }, []);

  const restoreSession = useCallback(() => {
    setUserInternal(DEMO_USER);
  }, []);

  const signOut = useCallback(() => {
    setAuthToken(null);
    setUserInternal(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      accessTier,
      setAccessTier,
      signIn,
      restoreSession,
      signOut,
    }),
    [user, accessTier, setAccessTier, signIn, restoreSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
