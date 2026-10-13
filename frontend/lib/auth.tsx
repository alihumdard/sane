"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiError, setAuthToken, setSessionExpireeHandler } from "./api";
import type { CompteInscriptionPayload } from "./types";

export interface AuthUser {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  role: "participant" | "demandeur" | "entreprise" | "recruteur" | "organisateur" | "administrateur";
  role_label: string;
  photo: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  inscrire: (payload: CompteInscriptionPayload) => Promise<AuthUser>;
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

  /*
   * A token can stop being valid while the visitor is still on the page — it
   * expires, or is revoked elsewhere. The client reports that back here, so
   * the session ends once instead of every page showing "Authentification
   * requise" while still looking signed in.
   */
  useEffect(() => {
    setSessionExpireeHandler(() => {
      ecrireToken(null);
      setAuthToken(null);
      setUser(null);
    });

    return () => setSessionExpireeHandler(null);
  }, []);

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

  /** Self-service signup; the account is live immediately, as at login. */
  const inscrire = useCallback(async (payload: CompteInscriptionPayload) => {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/inscription", payload);

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

  return <AuthContext value={{ user, loading, login, inscrire, logout }}>{children}</AuthContext>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  return ctx;
}

/**
 * Where each role lands once signed in.
 *
 * Shared because two places need it: the login form, which redirects here, and
 * the public header, whose account menu links to the visitor's own space.
 */
export const ACCUEIL_PAR_ROLE: Record<AuthUser["role"], string> = {
  administrateur: "/dashboard/admin",
  organisateur: "/dashboard/organisateur",
  recruteur: "/dashboard/recruteur",
  entreprise: "/dashboard/recruteur",
  demandeur: "/dashboard/participant",
  participant: "/dashboard/participant",
};
