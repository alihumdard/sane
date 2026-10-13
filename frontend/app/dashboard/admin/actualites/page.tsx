"use client";

import { Suspense } from "react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { ContenuCrud, type ChampFormulaire } from "@/components/dashboard/ContenuCrud";
import type { Colonne } from "@/components/dashboard/AdminTable";

interface Actualite {
  id: number;
  titre: string;
  slug: string;
  categorie: string;
  extrait: string | null;
  contenu: string;
  auteur: string | null;
  publiee: boolean;
  publiee_le: string | null;
  vues: number;
}

const CATEGORIES = [
  { value: "evenements", label: "Événement" },
  { value: "communiques", label: "Communiqué" },
  { value: "partenariats", label: "Partenariat" },
  { value: "formations", label: "Formation" },
  { value: "temoignages", label: "Témoignage" },
];

const colonnes: Colonne<Actualite>[] = [
  {
    cle: "titre",
    entete: "Titre",
    rendu: (a) => (
      <>
        <p className="font-semibold">{a.titre}</p>
        <p className="text-[12px] text-[var(--sane-text-light)]">{a.auteur ?? "—"}</p>
      </>
    ),
  },
  {
    cle: "categorie",
    entete: "Catégorie",
    masquer: "sm",
    rendu: (a) => CATEGORIES.find((c) => c.value === a.categorie)?.label ?? a.categorie,
  },
  {
    cle: "publiee",
    entete: "Statut",
    masquer: "md",
    rendu: (a) => (
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          a.publiee
            ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
            : "bg-[var(--sane-background)] text-[var(--sane-text-light)]"
        }`}
      >
        {a.publiee ? "Publiée" : "Brouillon"}
      </span>
    ),
  },
  { cle: "vues", entete: "Vues", masquer: "lg", rendu: (a) => a.vues },
];

const champs: ChampFormulaire[] = [
  { nom: "titre", label: "Titre", requis: true, pleineLargeur: true },
  { nom: "categorie", label: "Catégorie", type: "select", options: CATEGORIES, requis: true },
  { nom: "auteur", label: "Auteur" },
  { nom: "extrait", label: "Extrait", type: "textarea" },
  { nom: "contenu", label: "Contenu", type: "textarea", requis: true },
  { nom: "image", label: "Image (chemin)", pleineLargeur: true },
  { nom: "publiee", label: "Publier cette actualité", type: "checkbox", pleineLargeur: true },
];

export default function ActualitesAdminPage() {
  return (
    <AdminPage
      section="Actualités"
      titre="Actualités"
      description="Articles et communiqués affichés sur le site public"
    >
      <Suspense fallback={null}>
        <ContenuCrud<Actualite>
        endpoint="/admin/actualites"
        colonnes={colonnes}
        champs={champs}
        cle={(a) => a.id}
        libelle="actualité"
        vide="Aucune actualité."
        versFormulaire={(a) => ({
          titre: a.titre,
          categorie: a.categorie,
          auteur: a.auteur ?? "",
          extrait: a.extrait ?? "",
          contenu: a.contenu,
          publiee: a.publiee,
        })}
        />
      </Suspense>
    </AdminPage>
  );
}
