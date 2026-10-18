"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { PasswordField } from "@/components/ui/FormFields";
import { primaryBtn, textLink } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";

export function ReinitialiserMotDePasseCard() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [reussi, setReussi] = useState(false);

  async function reinitialiser(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);

    try {
      await api.post("/auth/mot-de-passe/reinitialiser", {
        token,
        email,
        password,
        password_confirmation: confirmation,
      });
      setReussi(true);
      setTimeout(() => router.push("/connexion"), 2500);
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? (err.fieldError("token") ?? err.fieldError("password") ?? err.message)
          : "Impossible de joindre le serveur. Vérifiez votre connexion."
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <h2 className="sane-h2 mb-2">Lien invalide</h2>
        <p className="sane-body mb-5">
          Ce lien de réinitialisation est incomplet ou a expiré. Demandez-en un nouveau.
        </p>
        <Link href="/mot-de-passe-oublie" className={textLink}>
          Demander un nouveau lien <ArrowRight size={11} />
        </Link>
      </div>
    );
  }

  if (reussi) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <CheckCircle2 size={36} className="mx-auto mb-3 text-[var(--sane-green)]" />
        <h2 className="sane-h2 mb-2">Mot de passe réinitialisé</h2>
        <p className="sane-body">Vous allez être redirigé vers la connexion…</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <h2 className="sane-h2 mb-1">Nouveau mot de passe</h2>
      <p className="sane-body mb-5">Choisissez un nouveau mot de passe pour {email}.</p>

      <p
        role="alert"
        className={`mb-4 items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] bg-[#fef2f2] p-3 ${erreur ? "flex" : "hidden"}`}
      >
        <span className="sane-small text-[var(--sane-red-dark)]">{erreur}</span>
      </p>

      <form onSubmit={reinitialiser} className="flex flex-col gap-4">
        <PasswordField
          id="password" label="Nouveau mot de passe" required
          autoComplete="new-password" placeholder="Au moins 8 caractères, une lettre et un chiffre"
          value={password} onChange={setPassword}
        />
        <PasswordField
          id="password_confirmation" label="Confirmer le mot de passe" required
          autoComplete="new-password" placeholder="Retapez le mot de passe"
          value={confirmation} onChange={setConfirmation}
        />

        <button type="submit" disabled={envoi} className={`${primaryBtn} w-full disabled:opacity-60`}>
          {envoi ? "Enregistrement…" : "Réinitialiser le mot de passe"}
          <SpinnerOu actif={envoi} size={16}><ArrowRight size={16} /></SpinnerOu>
        </button>
      </form>
    </div>
  );
}
