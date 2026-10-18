"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { TextField } from "@/components/ui/FormFields";
import { primaryBtn, textLink } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";

export function MotDePasseOublieCard() {
  const [email, setEmail] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoye, setEnvoye] = useState(false);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);

    try {
      await api.post("/auth/mot-de-passe/oublie", { email });
      setEnvoye(true);
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Impossible de joindre le serveur. Vérifiez votre connexion.");
    } finally {
      setEnvoi(false);
    }
  }

  if (envoye) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <CheckCircle2 size={36} className="mx-auto mb-3 text-[var(--sane-green)]" />
        <h2 className="sane-h2 mb-2">Vérifiez votre email</h2>
        <p className="sane-body mb-5">
          Si <strong>{email}</strong> correspond à un compte, un lien de réinitialisation vient de
          lui être envoyé. Il expire dans 60 minutes.
        </p>
        <Link href="/connexion" className={textLink}>
          <ArrowLeft size={13} /> Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <h2 className="sane-h2 mb-1">Mot de passe oublié</h2>
      <p className="sane-body mb-5">
        Indiquez votre email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      <p
        role="alert"
        className={`mb-4 items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] bg-[#fef2f2] p-3 ${erreur ? "flex" : "hidden"}`}
      >
        <span className="sane-small text-[var(--sane-red-dark)]">{erreur}</span>
      </p>

      <form onSubmit={envoyer} className="flex flex-col gap-4">
        <TextField id="email" label="Email" icon={Mail} required type="email" autoComplete="email" placeholder="votre@email.com" value={email} onChange={setEmail} />

        <button type="submit" disabled={envoi} className={`${primaryBtn} w-full disabled:opacity-60`}>
          {envoi ? "Envoi…" : "Envoyer le lien"}
          <SpinnerOu actif={envoi} size={16}><ArrowRight size={16} /></SpinnerOu>
        </button>
      </form>

      <p className="sane-small mt-5 text-center">
        <Link href="/connexion" className={textLink}>
          <ArrowLeft size={11} /> Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
