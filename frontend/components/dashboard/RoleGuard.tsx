"use client";

import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

interface RoleGuardProps {
  roles: AuthUser["role"][];
  children: React.ReactNode;
  /** Shown in the refusal notice, e.g. "l'espace recruteur". */
  espace: string;
}

/**
 * Client-side gate for a role-restricted area.
 *
 * Convenience only — the API enforces the same roles on every request, so this
 * saves the user a wall of 403s rather than providing the actual protection.
 */
export function RoleGuard({ roles, children, espace }: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--sane-background)]">
        <Loader2 size={24} className="animate-spin text-[var(--sane-green)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <Message titre="Connexion requise" texte={`Connectez-vous pour accéder à ${espace}.`}>
        <Link
          href="/connexion"
          className="rounded-lg bg-[var(--sane-orange)] px-5 py-2.5 text-[13px] font-bold text-white"
        >
          Se connecter
        </Link>
      </Message>
    );
  }

  if (!roles.includes(user.role)) {
    return (
      <Message
        titre="Accès réservé"
        texte={`Votre compte (${user.role_label}) n'a pas accès à ${espace}.`}
      >
        <Link href="/" className="text-[13px] font-semibold text-[var(--sane-green)]">
          Retour à l&apos;accueil
        </Link>
      </Message>
    );
  }

  return <>{children}</>;
}

function Message({
  titre,
  texte,
  children,
}: {
  titre: string;
  texte: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[var(--sane-background)] px-6 text-center">
      <Lock size={32} className="text-[var(--sane-text-light)]" />
      <h1 className="text-[18px] font-bold text-[var(--sane-green-deep)]">{titre}</h1>
      <p className="max-w-[360px] text-[13px] text-[var(--sane-text-light)]">{texte}</p>
      {children}
    </div>
  );
}
