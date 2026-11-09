"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";

interface Props {
  /** Pré-remplie quand on sort de la création de compte ; saisie sinon. */
  email?: string;
  /** Les inscriptions au salon ont leur propre route de renvoi. */
  cible?: "compte" | "salon";
  className?: string;
}

/**
 * Le bouton « renvoyer le lien de confirmation ».
 *
 * La réponse du serveur est la même que l'adresse corresponde à un compte en
 * attente ou non — ce formulaire ne doit pas pouvoir servir à savoir qui est
 * inscrit ici. On affiche donc ce qu'il renvoie, sans l'interpréter.
 *
 * Un envoi réussi masque le bouton : sans cela, la personne qui ne voit rien
 * arriver clique dix fois, se fait arrêter par la limitation de débit, et
 * conclut que le site est cassé.
 */
export function RenvoiVerification({ email: initial, cible = "compte", className }: Props) {
  const [saisie, setSaisie] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  /*
   * L'adresse fournie l'emporte sur la saisie locale.
   *
   * Sur la page de connexion, le parent passe le champ email au fil de la
   * frappe : un état local initialisé une fois garderait la valeur du premier
   * rendu — une chaîne vide — et le bouton resterait désactivé.
   */
  const email = initial ?? saisie;
  const setEmail = setSaisie;

  const route =
    cible === "salon" ? "/inscriptions/renvoyer-verification" : "/auth/renvoyer-verification";

  async function renvoyer() {
    if (!email.trim()) return;

    setEnvoi(true);
    setErreur(null);

    try {
      const res = await api.post<{ message: string }>(route, { email: email.trim() });

      setMessage(res.message);
    } catch {
      setErreur("Impossible d'envoyer le lien pour le moment. Réessayez dans quelques minutes.");
      setEnvoi(false);
    }
  }

  /*
   * Tout reste monté, basculé par `hidden`.
   *
   * Google Translate garde des références dans ce sous-arbre ; remplacer le
   * bouton par le message de succès — un nœud retiré, un autre inséré — tue la
   * page traduite avec un removeChild. Même règle que dans LoginCard et
   * components/ui/Select.tsx.
   */
  return (
    <div className={className}>
      <p
        className={`rounded-xl border border-[var(--sane-green)]/30 bg-[var(--sane-green-light)] px-4 py-3 text-[12px] text-[var(--sane-text)] ${message ? "block" : "hidden"}`}
      >
        {message}
      </p>

      <div className={message ? "hidden" : "block"}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          autoComplete="email"
          className={`mb-2 w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10 ${initial === undefined ? "block" : "hidden"}`}
        />

        <button
          type="button"
          onClick={renvoyer}
          disabled={envoi || !email.trim()}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-green-dark)] disabled:opacity-60"
        >
          <span className={envoi ? "hidden" : "inline"}>Renvoyer le lien de confirmation</span>
          <span className={envoi ? "inline" : "hidden"}>Envoi…</span>
          <Loader2 size={13} className={`animate-spin ${envoi ? "inline" : "hidden"}`} />
          <Send size={13} className={envoi ? "hidden" : "inline"} />
        </button>

        <p
          className={`mt-1.5 text-[12px] text-[var(--sane-red-dark)] ${erreur ? "block" : "hidden"}`}
        >
          {erreur}
        </p>
      </div>
    </div>
  );
}
