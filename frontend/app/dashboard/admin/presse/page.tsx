"use client";

import { Suspense } from "react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { ContenuCrud, type ChampFormulaire } from "@/components/dashboard/ContenuCrud";
import type { Colonne } from "@/components/dashboard/AdminTable";

interface ArticlePresse {
  id: number;
  titre: string;
  media: string;
  type: string;
  date_publication: string;
  lien: string | null;
  resume: string | null;
  publie: boolean;
}

const TYPES = [
  { value: "article", label: "Article" },
  { value: "communique", label: "Communiqué" },
  { value: "dossier", label: "Dossier de presse" },
  { value: "interview", label: "Interview" },
];

const colonnes: Colonne<ArticlePresse>[] = [
  {
    cle: "titre",
    entete: "Titre",
    rendu: (a) => (
      <>
        <p className="font-semibold">{a.titre}</p>
        <p className="text-[12px] text-[var(--sane-text-light)]">{a.media}</p>
      </>
    ),
  },
  {
    cle: "type",
    entete: "Type",
    masquer: "sm",
    rendu: (a) => TYPES.find((t) => t.value === a.type)?.label ?? a.type,
  },
  {
    cle: "date",
    entete: "Date",
    masquer: "md",
    rendu: (a) => new Date(a.date_publication).toLocaleDateString("fr-FR"),
  },
  {
    cle: "publie",
    entete: "Statut",
    masquer: "lg",
    rendu: (a) => (
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          a.publie
            ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
            : "bg-[var(--sane-background)] text-[var(--sane-text-light)]"
        }`}
      >
        {a.publie ? "Visible" : "Masqué"}
      </span>
    ),
  },
];

const champs: ChampFormulaire[] = [
  { nom: "titre", label: "Titre", requis: true, pleineLargeur: true },
  { nom: "media", label: "Média", requis: true },
  { nom: "type", label: "Type", type: "select", options: TYPES, requis: true },
  { nom: "date_publication", label: "Date de publication", type: "date", requis: true },
  { nom: "lien", label: "Lien", type: "url" },
  { nom: "resume", label: "Résumé", type: "textarea" },
  { nom: "publie", label: "Afficher cet élément", type: "checkbox", defaut: true, pleineLargeur: true },
];

export default function PresseAdminPage() {
  return (
    <AdminPage
      section="Presse"
      titre="Espace presse"
      description="Communiqués, dossiers et couverture médiatique"
    >
      <Suspense fallback={null}>
        <ContenuCrud<ArticlePresse>
        endpoint="/admin/presse"
        colonnes={colonnes}
        champs={champs}
        cle={(a) => a.id}
        libelle="élément"
        vide="Aucun élément."
        versFormulaire={(a) => ({
          titre: a.titre,
          media: a.media,
          type: a.type,
          date_publication: a.date_publication?.slice(0, 10),
          lien: a.lien ?? "",
          resume: a.resume ?? "",
          publie: a.publie,
        })}
        />
      </Suspense>
    </AdminPage>
  );
}
