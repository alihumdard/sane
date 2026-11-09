"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Mail } from "lucide-react";
import { RenvoiVerification } from "@/components/auth/RenvoiVerification";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { PasswordField, TextField } from "@/components/ui/FormFields";
import { primaryBtn, textLink } from "@/components/ui/styles";
import { ApiError } from "@/lib/api";
import { ACCUEIL_PAR_ROLE, useAuth } from "@/lib/auth";

export function LoginCard() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Un refus pour adresse non confirmée appelle une réponse que l'utilisateur
  // peut suivre : proposer le renvoi du lien, plutôt que de le laisser devant
  // un message dont il ne peut rien faire.
  const [aConfirmer, setAConfirmer] = useState(false);

  async function connecter(e: React.FormEvent) {
    e.preventDefault();

    setEnvoi(true);
    setErreur(null);
    setAConfirmer(false);

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

      // Le backend accompagne ce refus d'un drapeau : s'appuyer sur le texte
      // du message le ferait rater dès qu'on le reformule — ou dès que la
      // page est traduite.
      setAConfirmer(err instanceof ApiError && Boolean(err.errors.verification_requise));

      setEnvoi(false);
    }
  }

  return (
    <div id="login-form" className="w-full scroll-mt-24 rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      <h2 className="sane-h2 mb-1">Connexion</h2>
      <p className="sane-body mb-5">Accédez à votre espace SANEM</p>

      {/*
        Kept in the tree and hidden rather than mounted on demand: Google
        Translate holds references into this subtree, and adding or removing a
        node around them kills the page with removeChild.
      */}
      <p
        role="alert"
        className={`mb-4 items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] bg-[#fef2f2] p-3 ${erreur ? "flex" : "hidden"}`}
      >
        <AlertCircle size={15} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
        <span className="sane-small text-[var(--sane-red-dark)]">{erreur}</span>
      </p>

      {/* Même raison que l'alerte ci-dessus : basculé, jamais monté. */}
      <div
        className={`mb-4 rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-3 ${aConfirmer ? "block" : "hidden"}`}
      >
        <p className="sane-small mb-2 text-[var(--sane-text-light)]">
          Vous n&apos;avez pas reçu l&apos;email ? Regardez dans vos courriers indésirables, ou
          demandez un nouveau lien.
        </p>
        <RenvoiVerification email={email} />
      </div>

      <form onSubmit={connecter} className="flex flex-col gap-4">
        <TextField id="email" label="Email" icon={Mail} required type="email" autoComplete="email" placeholder="votre@email.com" value={email} onChange={setEmail} />
        <PasswordField id="password" label="Mot de passe" required autoComplete="current-password" placeholder="Votre mot de passe" value={password} onChange={setPassword} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="sane-small flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5 rounded accent-[var(--sane-green)]" />
            Se souvenir de moi
          </label>
          <Link href="/mot-de-passe-oublie" className={textLink}>
            Mot de passe oublié ?
          </Link>
        </div>

        <button type="submit" disabled={envoi} className={`${primaryBtn} w-full disabled:opacity-60`}>
          {envoi ? "Connexion…" : "Se connecter"}
          <SpinnerOu actif={envoi} size={16}><ArrowRight size={16} /></SpinnerOu>
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
