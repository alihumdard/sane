"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

const ROLES_AUTORISES = ["administrateur", "organisateur"];

/**
 * Gates the back office. The real enforcement is server-side — every admin
 * endpoint checks the token and role — so this only spares the user a wall of
 * 401s and offers somewhere to sign in.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--sane-background)]">
        <Loader2 size={24} className="animate-spin text-[var(--sane-green)]" />
      </div>
    );
  }

  if (!user) return <LoginPanel />;

  if (!ROLES_AUTORISES.includes(user.role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[var(--sane-background)] px-6 text-center">
        <Lock size={32} className="text-[var(--sane-text-light)]" />
        <h1 className="text-[18px] font-bold text-[var(--sane-green-deep)]">Accès réservé</h1>
        <p className="max-w-[360px] text-[13px] text-[var(--sane-text-light)]">
          Votre compte ({user.role_label}) n&apos;a pas accès au back-office.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

function LoginPanel() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? (err.fieldError("email") ?? err.message)
          : "Impossible de joindre le serveur."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--sane-background)] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] rounded-2xl border border-[var(--sane-border)] bg-white p-6 shadow-sm"
      >
        <h1 className="mb-1 text-[18px] font-bold text-[var(--sane-green-deep)]">Back-office SANEM</h1>
        <p className="mb-5 text-[12px] text-[var(--sane-text-light)]">
          Connectez-vous pour accéder à la gestion.
        </p>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-[#fef2f2] px-3 py-2 text-[12px] text-[var(--sane-red-dark)]">
            {error}
          </p>
        )}

        <label className="mb-1 block text-[11px] font-semibold text-[var(--sane-green-deep)]" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
        />

        <label className="mb-1 block text-[11px] font-semibold text-[var(--sane-green-deep)]" htmlFor="admin-password">
          Mot de passe
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--sane-orange)] py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
