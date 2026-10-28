"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, Loader2, MapPin, Video, X } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { EntretiensCalendrier } from "@/components/shared/EntretiensCalendrier";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { NavEspace } from "@/components/dashboard/NavEspace";
import { api, ApiError } from "@/lib/api";
import type { ApiCorrespondance, ApiEntretien, ApiProfilDemandeur } from "@/lib/types";

function formatCreneau(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const COULEUR: Record<string, string> = {
  en_attente: "bg-[#fff8ed] text-[var(--sane-orange)]",
  confirme: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  termine: "bg-[var(--sane-background)] text-[var(--sane-text-light)]",
  annule: "bg-[#fdf1f1] text-[var(--sane-red-dark)]",
};

function Contenu() {
  const [entretiens, setEntretiens] = useState<ApiEntretien[]>([]);
  const [correspondances, setCorrespondances] = useState<ApiCorrespondance[]>([]);
  const [profilPret, setProfilPret] = useState(true);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<number | null>(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const [e, c, p] = await Promise.all([
        api.get<{ data: ApiEntretien[] }>("/mes-entretiens"),
        api.get<{ data: ApiCorrespondance[] }>("/mes-correspondances"),
        api.get<{ data: ApiProfilDemandeur }>("/profil"),
      ]);

      setEntretiens(e.data);
      setCorrespondances(c.data);
      setProfilPret(p.data.visible && (p.data.taux_completion ?? 0) >= 100);
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Chargement impossible.");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  async function repondre(entretien: ApiEntretien, action: "confirmer" | "annuler") {
    setEnCours(entretien.id);

    try {
      await api.post(`/entretiens/${entretien.id}/${action}`);
      await charger();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Action impossible.");
    } finally {
      setEnCours(null);
    }
  }

  function carteEntretien(e: ApiEntretien) {
    return (
      <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[var(--sane-text)]">
              {e.candidature?.offre?.titre}
            </p>
            <p className="sane-small">
              {e.candidature?.offre?.entreprise?.nom} · Réf. {e.reference}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${COULEUR[e.statut]}`}>
            {e.statut_label}
          </span>
        </div>

        {e.creneau && (
          <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 sane-small">
              <Calendar size={14} className="text-[var(--sane-green)]" />
              {formatCreneau(e.creneau.debut)}
            </span>
            <span className="inline-flex items-center gap-1.5 sane-small">
              <MapPin size={14} className="text-[var(--sane-green)]" />
              {e.creneau.mode_label}
              {e.creneau.lieu && ` — ${e.creneau.lieu}`}
            </span>
          </div>
        )}

        {e.lien_visio && e.statut === "confirme" && (
          <a
            href={e.lien_visio}
            target="_blank"
            rel="noreferrer"
            className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sane-green)]"
          >
            <Video size={14} /> Rejoindre la visioconférence
          </a>
        )}

        {e.motif_annulation && (
          <p className="mb-3 rounded-lg bg-[#fdf1f1] p-3 text-[12px] text-[var(--sane-red-dark)]">
            Motif : {e.motif_annulation}
          </p>
        )}

        {!e.est_final && (
          <div className="flex flex-wrap gap-2">
            {e.statut === "en_attente" && (
              <button
                type="button"
                disabled={enCours === e.id}
                onClick={() => repondre(e, "confirmer")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sane-green)] px-4 py-2 text-[13px] font-bold text-white disabled:opacity-60"
              >
                <SpinnerOu actif={enCours === e.id} size={14}><CheckCircle2 size={14} /></SpinnerOu>
                Confirmer ma présence
              </button>
            )}
            <button
              type="button"
              disabled={enCours === e.id}
              onClick={() => repondre(e, "annuler")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[13px] font-semibold text-[var(--sane-red-dark)] disabled:opacity-60"
            >
              <X size={14} /> Annuler
            </button>
          </div>
        )}
      </div>
    );
  }

  if (chargement) {
    return (
      <p className="flex items-center justify-center gap-2 py-16">
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="sane-small">Chargement…</span>
      </p>
    );
  }

  return (
    <>
      <Alerte texte={erreur} className="mb-5" />

      <h2 className="sane-h3 mb-3">Calendrier</h2>

      {entretiens.length > 0 && (
        <div className="mb-8">
          <EntretiensCalendrier entretiens={entretiens} renderEntretien={carteEntretien} />
        </div>
      )}

      <h2 className="sane-h3 mb-3">Mes entretiens</h2>

      {entretiens.length === 0 ? (
        <p className="mb-10 rounded-2xl border border-[var(--sane-border)] bg-white py-10 text-center sane-small">
          Aucun entretien pour le moment. Les entreprises vous contacteront via vos candidatures.
        </p>
      ) : (
        <ul className="mb-10 flex flex-col gap-3">
          {entretiens.map((e) => (
            <li key={e.id}>{carteEntretien(e)}</li>
          ))}
        </ul>
      )}

      <h2 className="sane-h3 mb-1">Offres qui vous correspondent</h2>
      <p className="sane-small mb-3">
        Classées selon votre secteur, vos compétences, votre ville et votre expérience.
      </p>

      {correspondances.length === 0 ? (
        <p className="rounded-2xl border border-[var(--sane-border)] bg-white py-10 text-center sane-small">
          {profilPret
            ? "Aucune suggestion pour le moment. Les entreprises rapprochent les profils de leurs offres au fil de leurs recrutements."
            : "Complétez votre profil et rendez-le visible pour recevoir des suggestions."}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {correspondances.map((c) => (
            <li key={c.id} className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[var(--sane-text)]">{c.offre?.titre}</p>
                  <p className="sane-small">{c.offre?.entreprise?.nom}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--sane-green-light)] px-2.5 py-1 text-[12px] font-bold text-[var(--sane-green)]">
                  {c.score}%
                </span>
              </div>

              <ul className="mb-3 flex flex-col gap-0.5">
                {Object.values(c.details)
                  .filter((d) => d.obtenu > 0)
                  .slice(0, 3)
                  .map((d, i) => (
                    <li key={i} className="text-[12px] text-[var(--sane-text-light)]">
                      • {d.raison}
                    </li>
                  ))}
              </ul>

              {c.offre && (
                <Link href={`/emploi/${c.offre.slug}`} className="text-[13px] font-semibold text-[var(--sane-green)]">
                  Voir l&apos;offre →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function MesEntretiensPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--sane-background)] py-10 sm:py-14">
        <Container>
          <RoleGuard roles={["demandeur", "participant"]} espace="vos entretiens">
            <NavEspace />
            <Contenu />
          </RoleGuard>
        </Container>
      </main>
      <Footer />
    </>
  );
}
