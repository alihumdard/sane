"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MapPin, Mic } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Spinner } from "@/components/dashboard/Spinner";
import { api } from "@/lib/api";
import { tagStyles } from "./data";

interface SessionPublique {
  id: number;
  heure_debut: string;
  heure_fin: string | null;
  titre: string;
  description: string | null;
  categorie: string | null;
  lieu: string | null;
  intervenants: string | null;
  image_url: string | null;
}

export interface JourProgramme {
  jour: string;
  sessions: SessionPublique[];
}

const STYLE_PAR_DEFAUT = "bg-[var(--sane-background)] text-[var(--sane-text-light)]";

/** A category the schedule has never used still needs a chip. */
function styleCategorie(categorie: string | null): string {
  if (!categorie) return STYLE_PAR_DEFAUT;

  return (tagStyles as Record<string, string>)[categorie] ?? STYLE_PAR_DEFAUT;
}

function jourLisible(valeur: string): string {
  return new Date(valeur).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function SessionCard({ session }: { session: SessionPublique }) {
  const lignes = (session.description ?? "")
    .split(/\n{2,}/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <article className="flex flex-1 gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-[var(--sane-border)] transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
      <div
        className={`relative h-[60px] w-[80px] shrink-0 overflow-hidden rounded-lg sm:h-[72px] sm:w-[110px] ${
          session.image_url ? "block" : "hidden"
        }`}
      >
        <Image
          src={session.image_url ?? "/sane_deal.webp"}
          alt=""
          fill
          className="object-cover"
          sizes="110px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="sane-h3">{session.titre}</h3>

          {/* One paragraph becomes a sentence, several become a list. */}
          <ul className={`mt-1 flex-col gap-0.5 ${lignes.length > 1 ? "flex" : "hidden"}`}>
            {lignes.map((ligne) => (
              <li
                key={ligne}
                className="flex gap-1.5 text-[12px] leading-[1.5] text-[var(--sane-text-light)] sm:text-[13px]"
              >
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--sane-text-light)]" />
                {ligne}
              </li>
            ))}
          </ul>

          <p className={`sane-small mt-1 ${lignes.length === 1 ? "block" : "hidden"}`}>{lignes[0]}</p>

          <p
            className={`mt-1.5 items-center gap-1 text-[11px] text-[var(--sane-text-light)] ${
              session.intervenants ? "flex" : "hidden"
            }`}
          >
            <Mic size={11} className="shrink-0 text-[var(--sane-orange)]" />
            {session.intervenants}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-start gap-2 sm:flex-col sm:items-end sm:gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-[11px] ${styleCategorie(
              session.categorie
            )} ${session.categorie ? "inline-flex" : "hidden"}`}
          >
            {session.categorie}
          </span>
          <span
            className={`items-center gap-1 whitespace-nowrap text-[10px] text-[var(--sane-text-light)] sm:text-[11px] ${
              session.lieu ? "flex" : "hidden"
            }`}
          >
            <MapPin size={11} /> {session.lieu}
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * The schedule, read from the back-office.
 *
 * It used to be eight sessions written into a TypeScript file, for a single
 * unnamed day: moving the opening ceremony by half an hour meant a release.
 * The days come from the records themselves, so the salon can run over three
 * days — or five — without anyone touching this file.
 */
export function ScheduleSection({ initiaux = [] }: { initiaux?: JourProgramme[] }) {
  const [jours, setJours] = useState<JourProgramme[]>(initiaux);
  const [chargement, setChargement] = useState(initiaux.length === 0);
  const [jourActif, setJourActif] = useState(0);
  const [categorie, setCategorie] = useState("");

  useEffect(() => {
    let actif = true;

    api
      .get<{ data: JourProgramme[] }>("/programme")
      .then((res) => {
        if (actif) setJours(res.data ?? []);
      })
      .catch(() => {
        // An empty schedule rather than hours nobody confirmed.
      })
      .finally(() => {
        if (actif) setChargement(false);
      });

    return () => {
      actif = false;
    };
  }, []);

  const jour = jours[jourActif];

  const categories = useMemo(
    () => [...new Set((jour?.sessions ?? []).map((s) => s.categorie).filter(Boolean))] as string[],
    [jour]
  );

  const visibles = categorie
    ? (jour?.sessions ?? []).filter((s) => s.categorie === categorie)
    : jour?.sessions ?? [];

  return (
    <section id="programme" className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        {/* Day tabs — one per day the organisers have filled in. */}
        <div className={`gap-2 overflow-x-auto pb-1 ${jours.length > 1 ? "flex" : "hidden"}`}>
          {jours.map((j, i) => (
            <button
              key={j.jour}
              type="button"
              onClick={() => {
                setJourActif(i);
                setCategorie("");
              }}
              className={`shrink-0 rounded-xl border px-4 py-2.5 text-[12px] font-semibold capitalize transition-colors sm:text-[13px] ${
                i === jourActif
                  ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white"
                  : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]"
              }`}
            >
              {jourLisible(j.jour)}
            </button>
          ))}
        </div>

        <div className={`mt-4 gap-2 overflow-x-auto pb-1 ${categories.length > 1 ? "flex" : "hidden"}`}>
          <button
            type="button"
            onClick={() => setCategorie("")}
            className={`shrink-0 rounded-xl border px-3.5 py-2 text-[12px] font-semibold transition-colors ${
              categorie === ""
                ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white"
                : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green)]"
            }`}
          >
            Programme complet
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategorie(c)}
              className={`shrink-0 rounded-xl border px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                categorie === c
                  ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white"
                  : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[var(--sane-border)] sm:mt-8 sm:p-6">
          <div>
            <h2 className="sane-h2">Programme détaillé</h2>
            <p className="sane-small mt-1 capitalize">
              {jour ? jourLisible(jour.jour) : "Un programme riche et varié pour inspirer, former et connecter les talents."}
            </p>
          </div>

          <Spinner actif={chargement} className="py-10" />

          <div className="relative mt-5 sm:mt-6">
            <span
              className={`absolute left-[110px] top-2 bottom-2 w-px bg-[var(--sane-border)] ${
                visibles.length ? "hidden sm:block" : "hidden"
              }`}
            />

            <div className="flex flex-col gap-3">
              {visibles.map((session, i) => (
                <div key={session.id} className="flex items-start gap-3 sm:gap-4">
                  <time className="hidden w-[100px] shrink-0 pt-4 text-right text-[11px] font-bold text-[var(--sane-text)] sm:block">
                    {session.heure_debut}
                    {session.heure_fin ? ` – ${session.heure_fin}` : ""}
                  </time>
                  <span
                    className={`relative z-10 mt-4 hidden h-3 w-3 shrink-0 rounded-full ring-4 ring-white sm:block ${
                      i % 2 === 0 ? "bg-[var(--sane-green)]" : "bg-[var(--sane-orange)]"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <time className="mb-1 block text-[11px] font-bold text-[var(--sane-text)] sm:hidden">
                      {session.heure_debut}
                      {session.heure_fin ? ` – ${session.heure_fin}` : ""}
                    </time>
                    <SessionCard session={session} />
                  </div>
                </div>
              ))}
            </div>

            <p className={`sane-body py-10 text-center ${!chargement && visibles.length === 0 ? "block" : "hidden"}`}>
              Le programme sera publié prochainement.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
