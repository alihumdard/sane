"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, LogIn, Send, UserRound } from "lucide-react";
import { primaryBtn } from "@/components/ui/styles";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ApiCandidature, ApiOffre } from "@/lib/types";

/**
 * Application panel on an offer page.
 *
 * Only a jobseeker may apply, so the card shows the state that fits the
 * visitor: a prompt to sign in, the form, or a confirmation.
 */
export function PostulerCard({ offre }: { offre: ApiOffre }) {
  const { user, loading } = useAuth();

  const [lettre, setLettre] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [candidature, setCandidature] = useState<ApiCandidature | null>(null);
  const [dejaPostule, setDejaPostule] = useState(offre.deja_postule ?? false);
  const [manque, setManque] = useState<string[] | null>(null);

  const peutPostuler = user?.role === "demandeur" || user?.role === "participant";

  /*
   * The page itself is rendered on the server and cached, so it is fetched
   * without anyone's token: `offre.deja_postule` is therefore never set for a
   * signed-in visitor, and a reload would offer the form again to someone who
   * had already applied. Asking once from the browser, where the token is,
   * settles it — the server copy stays shared and indexable.
   */
  useEffect(() => {
    if (!user || !peutPostuler) return;

    let annule = false;

    api
      .get<{ data: ApiOffre }>(`/offres/${encodeURIComponent(offre.slug)}`)
      .then((res) => {
        if (!annule && res.data.deja_postule) setDejaPostule(true);
      })
      .catch(() => {
        // Nothing to show the visitor: the form stays, and a duplicate is
        // still refused by the server with a 409.
      });

    api
      .get<{ data: { manque_pour_postuler?: string[] } }>("/profil")
      .then((res) => {
        if (!annule) setManque(res.data.manque_pour_postuler ?? []);
      })
      .catch(() => {
        // Leave the form in place; the server still checks on submit.
      });

    return () => {
      annule = true;
    };
  }, [user, peutPostuler, offre.slug]);

  async function postuler(e: React.FormEvent) {
    e.preventDefault();

    setEnvoi(true);
    setErreur(null);

    try {
      const res = await api.post<{ message: string; data: ApiCandidature }>(
        `/offres/${encodeURIComponent(offre.slug)}/postuler`,
        { lettre_motivation: lettre || undefined }
      );
      setCandidature(res.data);
    } catch (e) {
      // 409 means the server refused a duplicate: say so as a state, not as an
      // error the visitor could retry their way out of.
      if (e instanceof ApiError && e.status === 409) {
        setDejaPostule(true);

        return;
      }

      setErreur(
        e instanceof ApiError
          ? e.fieldError("lettre_motivation") ?? e.message
          : "Impossible d'envoyer votre candidature. Réessayez."
      );
    } finally {
      setEnvoi(false);
    }
  }

  const carte = "rounded-2xl border border-[var(--sane-border)] bg-white p-5 shadow-sm";

  if (candidature) {
    return (
      <div className={carte} role="status">
        <CheckCircle2 size={28} className="mb-2 text-[var(--sane-green)]" />
        <h3 className="sane-h3 mb-1">Candidature envoyée</h3>
        <p className="sane-small mb-3">
          Votre référence : <strong className="text-[var(--sane-green)]">{candidature.reference}</strong>
        </p>
        <Link href="/dashboard/participant" className="text-[13px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]">
          Suivre mes candidatures →
        </Link>
      </div>
    );
  }

  if (!offre.ouverte) {
    return (
      <div className={carte}>
        <h3 className="sane-h3 mb-1">Candidatures closes</h3>
        <p className="sane-small">
          Cette offre n&apos;accepte plus de candidatures. Consultez les autres offres disponibles.
        </p>
        <Link href="/emploi" className="mt-3 inline-block text-[13px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]">
          Voir les offres →
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={carte}>
        <p className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin text-[var(--sane-green)]" />
          <span className="sane-small">Chargement…</span>
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={carte}>
        <h3 className="sane-h3 mb-1">Postuler à cette offre</h3>
        <p className="sane-small mb-4">
          Connectez-vous ou créez un compte demandeur d&apos;emploi pour envoyer votre candidature.
        </p>
        <Link href={`/connexion?suite=/emploi/${offre.slug}`} className={`${primaryBtn} w-full`}>
          <LogIn size={15} /> Se connecter
        </Link>
      </div>
    );
  }

  if (dejaPostule) {
    return (
      <div className={carte} role="status">
        <CheckCircle2 size={28} className="mb-2 text-[var(--sane-green)]" />
        <h3 className="sane-h3 mb-1">Déjà postulé</h3>
        <p className="sane-small">Vous avez déjà envoyé une candidature pour cette offre.</p>
      </div>
    );
  }

  if (manque && manque.length > 0) {
    const libelles = { cv: "votre CV", formation: "au moins une formation" } as const;
    const liste = manque.map((m) => libelles[m as keyof typeof libelles] ?? m);

    return (
      <div className={carte}>
        <h3 className="sane-h3 mb-1">Complétez votre profil</h3>
        <p className="sane-small mb-4">
          Il vous manque {liste.join(" et ")} avant de pouvoir postuler. Le recruteur
          n'aurait rien à consulter sans cela.
        </p>
        <Link href="/dashboard/profil" className={`${primaryBtn} w-full`}>
          <UserRound size={15} /> Compléter mon profil
        </Link>
      </div>
    );
  }

  if (!peutPostuler) {
    return (
      <div className={carte}>
        <h3 className="sane-h3 mb-1">Postuler à cette offre</h3>
        <p className="sane-small">
          Seuls les comptes demandeur d&apos;emploi peuvent postuler aux offres.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={postuler} className={carte}>
      <h3 className="sane-h3 mb-1">Postuler à cette offre</h3>
      <p className="sane-small mb-4">
        Votre profil et votre CV seront transmis au recruteur.
      </p>

      <label htmlFor="lettre" className="mb-2 block text-[13px] font-semibold text-[var(--sane-text)]">
        Lettre de motivation <span className="font-normal opacity-70">(facultatif)</span>
      </label>
      <textarea
        id="lettre"
        value={lettre}
        onChange={(e) => setLettre(e.target.value)}
        rows={6}
        maxLength={5000}
        placeholder="Présentez en quelques lignes votre motivation pour ce poste…"
        className="mb-1 w-full rounded-lg border border-[var(--sane-border)] p-3 text-[13px] outline-none transition-colors focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10"
      />
      <p className="sane-small mb-4 text-right opacity-60">{lettre.length}/5000</p>

      <p role="alert" className={`mb-3 items-start gap-2 text-[var(--sane-red-dark)] ${erreur ? "flex" : "hidden"}`}>
        <AlertCircle size={15} className="mt-0.5 shrink-0" />
        <span className="text-[13px] text-[var(--sane-red-dark)]">{erreur}</span>
      </p>

      <button type="submit" disabled={envoi} className={`${primaryBtn} w-full disabled:opacity-60`}>
        {envoi ? (
          <>
            Envoi en cours… <Loader2 size={15} className="animate-spin" />
          </>
        ) : (
          <>
            Envoyer ma candidature <Send size={15} />
          </>
        )}
      </button>
    </form>
  );
}
