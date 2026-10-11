"use client";

import { AdminPage } from "@/components/dashboard/AdminPage";
import { ContenuCrud, type ChampFormulaire } from "@/components/dashboard/ContenuCrud";
import type { Colonne } from "@/components/dashboard/AdminTable";

interface Partenaire {
  id: number;
  nom: string;
  slug: string;
  type: string;
  logo: string | null;
  site_web: string | null;
  description: string | null;
  ordre: number;
  publie: boolean;
}

const TYPES = [
  { value: "institutionnel", label: "Institutionnel" },
  { value: "partenaire", label: "Partenaire" },
  { value: "sponsor", label: "Sponsor" },
  { value: "media", label: "Média" },
];

const colonnes: Colonne<Partenaire>[] = [
  {
    cle: "nom",
    entete: "Partenaire",
    rendu: (p) => (
      <>
        <p className="font-semibold">{p.nom}</p>
        {p.site_web && <p className="text-[12px] text-[var(--sane-text-light)]">{p.site_web}</p>}
      </>
    ),
  },
  {
    cle: "type",
    entete: "Type",
    masquer: "sm",
    rendu: (p) => TYPES.find((t) => t.value === p.type)?.label ?? p.type,
  },
  { cle: "ordre", entete: "Ordre", masquer: "md", rendu: (p) => p.ordre },
  {
    cle: "publie",
    entete: "Statut",
    masquer: "md",
    rendu: (p) => (
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          p.publie
            ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
            : "bg-[var(--sane-background)] text-[var(--sane-text-light)]"
        }`}
      >
        {p.publie ? "Visible" : "Masqué"}
      </span>
    ),
  },
];

const champs: ChampFormulaire[] = [
  { nom: "nom", label: "Nom", requis: true },
  { nom: "type", label: "Type", type: "select", options: TYPES, requis: true },
  { nom: "logo", label: "Logo (chemin)" },
  { nom: "site_web", label: "Site web", type: "url" },
  { nom: "ordre", label: "Ordre d'affichage", type: "number" },
  { nom: "description", label: "Description", type: "textarea" },
  { nom: "publie", label: "Afficher ce partenaire", type: "checkbox", pleineLargeur: true },
];

export default function PartenairesAdminPage() {
  return (
    <AdminPage
      section="Partenaires"
      titre="Partenaires"
      description="Partenaires et sponsors affichés sur le site"
    >
      <ContenuCrud<Partenaire>
        endpoint="/admin/partenaires"
        colonnes={colonnes}
        champs={champs}
        cle={(p) => p.id}
        libelle="partenaire"
        vide="Aucun partenaire."
        versFormulaire={(p) => ({
          nom: p.nom,
          type: p.type,
          logo: p.logo ?? "",
          site_web: p.site_web ?? "",
          ordre: p.ordre,
          description: p.description ?? "",
          publie: p.publie,
        })}
      />
    </AdminPage>
  );
}
