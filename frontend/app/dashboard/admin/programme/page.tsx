"use client";

import { Suspense } from "react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { ContenuCrud, type ChampFormulaire } from "@/components/dashboard/ContenuCrud";
import type { Colonne } from "@/components/dashboard/AdminTable";

interface SessionProgramme {
  id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string | null;
  titre: string;
  description: string | null;
  categorie: string | null;
  lieu: string | null;
  intervenants: string | null;
  image: string | null;
  ordre: number;
  publiee: boolean;
}

/**
 * The kinds of session the schedule already uses.
 *
 * Offered rather than imposed: the field is free text on the server, because
 * a salon invents a kind of session the week before and that must not wait
 * for a release.
 */
const CATEGORIES = [
  { value: "Accueil", label: "Accueil" },
  { value: "Cérémonie", label: "Cérémonie" },
  { value: "Conférence", label: "Conférence" },
  { value: "Panel", label: "Panel" },
  { value: "Formation", label: "Formation" },
  { value: "Recrutement", label: "Recrutement" },
  { value: "Networking", label: "Networking" },
  { value: "Atelier", label: "Atelier" },
];

/** Postgres answers a time column as HH:MM:SS; the input wants HH:MM. */
const heure = (valeur: string | null) => (valeur ?? "").slice(0, 5);

const jourLisible = (valeur: string) =>
  new Date(valeur).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });

const colonnes: Colonne<SessionProgramme>[] = [
  {
    cle: "jour",
    entete: "Jour",
    rendu: (s) => (
      <div>
        <p className="font-semibold">{jourLisible(s.jour)}</p>
        <p className="text-[12px] text-[var(--sane-text-light)]">
          {heure(s.heure_debut)}
          {s.heure_fin ? ` – ${heure(s.heure_fin)}` : ""}
        </p>
      </div>
    ),
  },
  {
    cle: "titre",
    entete: "Session",
    rendu: (s) => (
      <div className="min-w-0">
        <p className="font-semibold">{s.titre}</p>
        <p className="truncate text-[12px] text-[var(--sane-text-light)]">{s.lieu}</p>
      </div>
    ),
  },
  { cle: "categorie", entete: "Type", masquer: "sm", rendu: (s) => s.categorie ?? "—" },
  { cle: "ordre", entete: "Ordre", masquer: "md", rendu: (s) => s.ordre },
  {
    cle: "publiee",
    entete: "Statut",
    masquer: "md",
    rendu: (s) => (
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          s.publiee
            ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
            : "bg-[var(--sane-background)] text-[var(--sane-text-light)]"
        }`}
      >
        {s.publiee ? "Publiée" : "Masquée"}
      </span>
    ),
  },
];

const champs: ChampFormulaire[] = [
  { nom: "jour", label: "Jour", type: "date", requis: true },
  { nom: "categorie", label: "Type de session", type: "select", options: CATEGORIES },
  { nom: "heure_debut", label: "Heure de début", type: "time", requis: true },
  { nom: "heure_fin", label: "Heure de fin", type: "time" },
  { nom: "titre", label: "Titre", requis: true, pleineLargeur: true },
  { nom: "description", label: "Description", type: "textarea", pleineLargeur: true },
  { nom: "lieu", label: "Lieu", placeholder: "ex. Grande salle" },
  { nom: "intervenants", label: "Intervenants", placeholder: "ex. M. Diallo, Mme Issoufou" },
  { nom: "ordre", label: "Ordre d'affichage", type: "number" },
  { nom: "publiee", label: "Afficher cette session sur le site", type: "checkbox", pleineLargeur: true },
];

export default function ProgrammeAdminPage() {
  return (
    <AdminPage
      section="Programme"
      titre="Programme"
      description="Les sessions affichées sur la page Programme du site public"
    >
      <Suspense fallback={null}>
        <ContenuCrud<SessionProgramme>
          endpoint="/admin/programme"
          colonnes={colonnes}
          champs={champs}
          cle={(s) => s.id}
          libelle="session"
          vide="Aucune session. Ajoutez-en une pour remplir la page Programme."
          versFormulaire={(s) => ({
            jour: s.jour?.slice(0, 10) ?? "",
            heure_debut: heure(s.heure_debut),
            heure_fin: heure(s.heure_fin),
            titre: s.titre,
            description: s.description ?? "",
            categorie: s.categorie ?? "",
            lieu: s.lieu ?? "",
            intervenants: s.intervenants ?? "",
            ordre: s.ordre,
            publiee: s.publiee,
          })}
        />
      </Suspense>
    </AdminPage>
  );
}
