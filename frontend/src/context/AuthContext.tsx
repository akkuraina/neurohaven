import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authPost, clearStoredToken, fetchMe, getStoredToken, setStoredToken } from "../lib/authApi";
import type { AuthUser } from "../types/auth";

export type { AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          const me = await fetchMe();
          if (cancelled) return;
          if (me) {
            setUser(me);
            setLoading(false);
            return;
          }
        } catch {
          /* ignore */
        }
        if (cancelled) return;
        clearStoredToken();
      }
      if (!cancelled) setLoading(false);
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const res = await authPost("/api/auth/login", { email, password }, false);
    const body = (await res.json().catch(() => ({}))) as { token?: string; user?: AuthUser; error?: string };
    if (!res.ok) throw new Error(body.error || "Login failed");
    if (!body.token || !body.user) throw new Error("Invalid server response");
    setStoredToken(body.token);
    setUser(body.user);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const res = await authPost("/api/auth/register", { email, password, name: name || undefined }, false);
    const body = (await res.json().catch(() => ({}))) as { token?: string; user?: AuthUser; error?: string };
    if (!res.ok) throw new Error(body.error || "Registration failed");
    if (!body.token || !body.user) throw new Error("Invalid server response");
    setStoredToken(body.token);
    setUser(body.user);
  }, []);

  const logout = useCallback(async () => {
    clearStoredToken();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    loginWithPassword,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
