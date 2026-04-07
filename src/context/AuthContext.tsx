import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { readAccessTier, writeAccessTier, type AccessTier } from "@/lib/access";

const STORAGE_KEY = "imagine.auth.session";
const SIGNED_OUT_KEY = "imagine.auth.signedOut";

const DEMO_USER: AuthUser = {
  email: "demo@imagine.io",
  name: "Riley Chen",
  orgLabel: "imagine.io",
};

export type AuthUser = {
  email: string;
  name: string;
  orgLabel: string;
};

function readStoredUser(): AuthUser | null {
  try {
    if (localStorage.getItem(SIGNED_OUT_KEY) === "1") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthUser;
      if (!parsed?.email || !parsed?.name) return null;
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

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Product window: explore / standard vs full (API keys, batch jobs, export pipelines). */
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
  const [accessTier, setAccessTierState] = useState<AccessTier>(() => readAccessTier());

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
