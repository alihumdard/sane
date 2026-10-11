"use client";

import Link from "next/link";
import { ArrowLeft, Banknote, Briefcase, Building2, Calendar, Clock, GraduationCap, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { ApiOffre } from "@/lib/types";
import { PostulerCard } from "./PostulerCard";

function formatDate(iso: string | null): string {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** "450 000 – 650 000 FCFA", or a single bound when only one is given. */
function formatSalaire(min: number | null, max: number | null): string | null {
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  if (min && max) return `${fmt(min)} – ${fmt(max)} FCFA`;
  if (min) return `À partir de ${fmt(min)} FCFA`;
  if (max) return `Jusqu'à ${fmt(max)} FCFA`;

  return null;
}

/** Renders paragraphs from a plain-text block, preserving the author's breaks. */
function Paragraphes({ texte }: { texte: string }) {
  return (
    <>
      {texte
        .split(/\n+/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="sane-body mb-3 last:mb-0">
            {p}
          </p>
        ))}
    </>
  );
}

export function OffreDetail({ offre }: { offre: ApiOffre }) {
  const salaire = formatSalaire(offre.salaire_min, offre.salaire_max);

  const meta = [
    { icon: MapPin, label: "Lieu", valeur: offre.ville },
    { icon: Briefcase, label: "Contrat", valeur: offre.type_contrat_label },
    { icon: Building2, label: "Secteur", valeur: offre.secteur },
    { icon: Clock, label: "Expérience", valeur: offre.experience_requise },
    { icon: GraduationCap, label: "Niveau d'étude", valeur: offre.niveau_etude },
    { icon: Banknote, label: "Rémunération", valeur: salaire },
    { icon: Calendar, label: "Date limite", valeur: offre.date_limite ? formatDate(offre.date_limite) : null },
  ].filter((m) => Boolean(m.valeur));

  return (
    <>
      <section className="bg-[var(--sane-green-light)] py-8 sm:py-10">
        <Container>
          <Link
            href="/emploi"
            className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-orange)]"
          >
            <ArrowLeft size={14} /> Toutes les offres
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="mb-2 text-[22px] font-bold leading-tight text-[var(--sane-text)] sm:text-[length:var(--fs-h1)]">
                {offre.titre}
              </h1>
              <p className="sane-body">
                {offre.entreprise?.nom}
                {offre.entreprise?.verifiee && (
                  <span className="ml-2 rounded-full bg-[var(--sane-green)] px-2 py-0.5 text-[11px] font-semibold text-white">
                    Vérifiée
                  </span>
                )}
              </p>
            </div>

            {!offre.ouverte && (
              <span className="rounded-full bg-[var(--sane-red-dark)] px-3 py-1 text-[12px] font-semibold text-white">
                Candidatures closes
              </span>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
            <div className="min-w-0">
              <dl className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {meta.map(({ icon: Icon, label, valeur }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl border border-[var(--sane-border)] p-3">
                    <Icon size={17} className="mt-0.5 shrink-0 text-[var(--sane-green)]" />
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sane-text-light)]">
                        {label}
                      </dt>
                      <dd className="text-[13px] font-medium text-[var(--sane-text)]">{valeur}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <h2 className="sane-h3 mb-2">Description du poste</h2>
              <div className="mb-6">
                <Paragraphes texte={offre.description} />
              </div>

              {offre.missions && (
                <>
                  <h2 className="sane-h3 mb-2">Missions</h2>
                  <div className="mb-6">
                    <Paragraphes texte={offre.missions} />
                  </div>
                </>
              )}

              {offre.profil_recherche && (
                <>
                  <h2 className="sane-h3 mb-2">Profil recherché</h2>
                  <div className="mb-6">
                    <Paragraphes texte={offre.profil_recherche} />
                  </div>
                </>
              )}

              {offre.entreprise?.description && (
                <>
                  <h2 className="sane-h3 mb-2">À propos de {offre.entreprise.nom}</h2>
                  <p className="sane-body">{offre.entreprise.description}</p>
                </>
              )}
            </div>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <PostulerCard offre={offre} />
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
