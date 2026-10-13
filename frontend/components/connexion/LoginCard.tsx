"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, Mail } from "lucide-react";
import { PasswordField, TextField } from "@/components/ui/FormFields";
import { primaryBtn, textLink } from "@/components/ui/styles";
import { ApiError } from "@/lib/api";
import { ACCUEIL_PAR_ROLE, useAuth } from "@/lib/auth";
import { roles } from "./data";

interface Props {
  activeRole: string;
  onRoleChange: (key: string) => void;
}

/** Role tabs + email/password form. The selected role is owned by the parent (the "Espaces" cards can change it). */
export function LoginCard({ activeRole, onRoleChange }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function connecter(e: React.FormEvent) {
    e.preventDefault();

    setEnvoi(true);
    setErreur(null);

    try {
      const user = await login(email, password);

      // Back to wherever the visitor was sent from, else their own space.
      const suite = params.get("suite");
      router.push(suite && suite.startsWith("/") ? suite : ACCUEIL_PAR_ROLE[user.role]);
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? (err.fieldError("email") ?? err.message)
          : "Impossible de joindre le serveur. Vérifiez votre connexion."
      );
      setEnvoi(false);
    }
  }

  return (
    <div id="login-form" className="w-full scroll-mt-24 rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <h2 className="sane-h2 mb-1">Connexion</h2>
      <p className="sane-body mb-5">Accédez à votre espace SANEM</p>

      <div role="group" aria-label="Type de compte" className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {roles.map(({ key, title, icon: Icon }) => {
          const active = activeRole === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onRoleChange(key)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-1.5 rounded-lg border px-1 py-3 text-center transition-colors ${
                active
                  ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white"
                  : "border-[var(--sane-border)] bg-white text-[var(--sane-text-light)] hover:border-[var(--sane-green)]/40"
              }`}
            >
              <Icon size={20} className={active ? "text-white" : "text-[var(--sane-green)]"} />
              <span className="text-[11px] font-semibold leading-tight">{title}</span>
            </button>
          );
        })}
      </div>

      {erreur && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] bg-[#fef2f2] p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
          <span className="sane-small text-[var(--sane-red-dark)]">{erreur}</span>
        </p>
      )}

      <form onSubmit={connecter} className="flex flex-col gap-4">
        <TextField id="email" label="Email" icon={Mail} required type="email" autoComplete="email" placeholder="votre@email.com" value={email} onChange={setEmail} />
        <PasswordField id="password" label="Mot de passe" required autoComplete="current-password" placeholder="Votre mot de passe" value={password} onChange={setPassword} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="sane-small flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5 rounded accent-[var(--sane-green)]" />
            Se souvenir de moi
          </label>
          <Link href="#" className={textLink}>
            Mot de passe oublié ?
          </Link>
        </div>

        <button type="submit" disabled={envoi} className={`${primaryBtn} w-full disabled:opacity-60`}>
          {envoi ? (
            <>
              Connexion… <Loader2 size={16} className="animate-spin" />
            </>
          ) : (
            <>
              Se connecter <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="sane-small mt-5 text-center">
        Vous n&apos;avez pas encore de compte ?{" "}
        <Link href="/creer-compte" className={textLink}>
          Créer un compte <ArrowRight size={11} />
        </Link>
      </p>
    </div>
  );
}
