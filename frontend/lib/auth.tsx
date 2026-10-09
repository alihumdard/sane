"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiError, setAuthToken } from "./api";

export interface AuthUser {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  role: "participant" | "entreprise" | "recruteur" | "organisateur" | "administrateur";
  role_label: string;
  photo: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = "sanem_token";

const AuthContext = createContext<AuthState | null>(null);

function lireToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function ecrireToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Private browsing or blocked storage — the session simply won't persist.
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session on mount: a stored token is only trusted once /me confirms it.
  useEffect(() => {
    const token = lireToken();

    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);

    api
      .get<{ user: AuthUser }>("/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => {
        ecrireToken(null);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", { email, password });

    ecrireToken(res.token);
    setAuthToken(res.token);
    setUser(res.user);

    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // An already-expired token still means the local session is over.
      if (!(e instanceof ApiError) || e.status !== 401) throw e;
    } finally {
      ecrireToken(null);
      setAuthToken(null);
      setUser(null);
    }
  }, []);

  return <AuthContext value={{ user, loading, login, logout }}>{children}</AuthContext>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  return ctx;
}
