import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { authPost, clearStoredToken, fetchMe, getStoredToken, setStoredToken } from "@/lib/authApi";
import type { AuthUser } from "@/types/auth";

export type { AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubFirebase: (() => void) | undefined;

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

      unsubFirebase = onAuthStateChanged(auth, async (fbUser) => {
        if (cancelled) return;
        if (fbUser) {
          try {
            const idToken = await fbUser.getIdToken();
            const res = await authPost("/api/auth/google", { idToken }, false);
            const body = (await res.json().catch(() => ({}))) as { token?: string; user?: AuthUser; error?: string };
            if (res.ok && body.token && body.user) {
              setStoredToken(body.token);
              setUser(body.user);
            } else {
              console.error("Google session sync failed:", body.error || res.statusText);
            }
          } catch (e) {
            console.error(e);
          }
        }
        if (!cancelled) setLoading(false);
      });
    };

    void bootstrap();

    return () => {
      cancelled = true;
      unsubFirebase?.();
    };
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const res = await authPost("/api/auth/login", { email, password }, false);
    const body = (await res.json().catch(() => ({}))) as { token?: string; user?: AuthUser; error?: string };
    if (!res.ok) throw new Error(body.error || "Login failed");
    if (!body.token || !body.user) throw new Error("Invalid server response");
    setStoredToken(body.token);
    setUser(body.user);
    await signOut(auth).catch(() => {});
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const res = await authPost("/api/auth/register", { email, password, name: name || undefined }, false);
    const body = (await res.json().catch(() => ({}))) as { token?: string; user?: AuthUser; error?: string };
    if (!res.ok) throw new Error(body.error || "Registration failed");
    if (!body.token || !body.user) throw new Error("Invalid server response");
    setStoredToken(body.token);
    setUser(body.user);
    await signOut(auth).catch(() => {});
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const cred = await signInWithPopup(auth, provider);
    const idToken = await cred.user.getIdToken();
    const res = await authPost("/api/auth/google", { idToken }, false);
    const body = (await res.json().catch(() => ({}))) as { token?: string; user?: AuthUser; error?: string };
    if (!res.ok) {
      await signOut(auth).catch(() => {});
      throw new Error(body.error || "Google sign-in failed");
    }
    if (!body.token || !body.user) throw new Error("Invalid server response");
    setStoredToken(body.token);
    setUser(body.user);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth).catch(() => {});
    clearStoredToken();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    loginWithPassword,
    register,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
