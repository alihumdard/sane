"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { PasswordField, TextField } from "@/components/ui/FormFields";
import { primaryBtn, textLink } from "@/components/ui/styles";
import { roles } from "./data";

interface Props {
  activeRole: string;
  onRoleChange: (key: string) => void;
}

const socialBtn =
  "flex items-center justify-center gap-2 rounded-lg border border-[var(--sane-border)] px-2 py-2.5 text-[length:var(--fs-small)] font-medium text-[var(--sane-text)] transition-colors hover:bg-[var(--sane-background)]";

/** Role tabs + email/password form. The selected role is owned by the parent (the "Espaces" cards can change it). */
export function LoginCard({ activeRole, onRoleChange }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div id="login-form" className="w-full scroll-mt-24 rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <h2 className="sane-h2 mb-1">Connexion</h2>
      <p className="sane-body mb-5">Accédez à votre espace SANE</p>

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

      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
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

        <button type="submit" className={`${primaryBtn} w-full`}>
          Se connecter <ArrowRight size={16} />
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--sane-border)]" />
        <span className="sane-small text-[11px]">ou continuer avec</span>
        <span className="h-px flex-1 bg-[var(--sane-border)]" />
      </div>

      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        <button type="button" className={socialBtn}>
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button type="button" className={socialBtn}>
          <svg className="h-4 w-4 shrink-0 fill-[#0077b5]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.764 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          LinkedIn
        </button>
      </div>

      <p className="sane-small mt-5 text-center">
        Vous n&apos;avez pas encore de compte ?{" "}
        <Link href="/inscription" className={textLink}>
          S&apos;inscrire maintenant <ArrowRight size={11} />
        </Link>
      </p>
    </div>
  );
}
