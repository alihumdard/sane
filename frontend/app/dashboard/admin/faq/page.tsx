"use client";

import { Suspense } from "react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { ContenuCrud, type ChampFormulaire } from "@/components/dashboard/ContenuCrud";
import type { Colonne } from "@/components/dashboard/AdminTable";

interface FaqEntree {
  id: number;
  categorie: string;
  question: string;
  reponse: string;
  ordre: number;
  publiee: boolean;
}

const CATEGORIES = [
  { value: "generalites", label: "Généralités" },
  { value: "inscriptions", label: "Inscriptions" },
  { value: "formations", label: "Formations" },
  { value: "emploi", label: "Emploi" },
  { value: "entreprises", label: "Entreprises" },
];

const colonnes: Colonne<FaqEntree>[] = [
  {
    cle: "question",
    entete: "Question",
    rendu: (f) => <p className="font-semibold">{f.question}</p>,
  },
  {
    cle: "categorie",
    entete: "Catégorie",
    masquer: "sm",
    rendu: (f) => CATEGORIES.find((c) => c.value === f.categorie)?.label ?? f.categorie,
  },
  { cle: "ordre", entete: "Ordre", masquer: "md", rendu: (f) => f.ordre },
  {
    cle: "publiee",
    entete: "Statut",
    masquer: "md",
    rendu: (f) => (
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          f.publiee
            ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
            : "bg-[var(--sane-background)] text-[var(--sane-text-light)]"
        }`}
      >
        {f.publiee ? "Publiée" : "Masquée"}
      </span>
    ),
  },
];

const champs: ChampFormulaire[] = [
  { nom: "categorie", label: "Catégorie", type: "select", options: CATEGORIES, requis: true },
  { nom: "ordre", label: "Ordre d'affichage", type: "number" },
  { nom: "question", label: "Question", requis: true, pleineLargeur: true },
  { nom: "reponse", label: "Réponse", type: "textarea", requis: true },
  { nom: "publiee", label: "Afficher cette question", type: "checkbox", pleineLargeur: true },
];

export default function FaqAdminPage() {
  return (
    <AdminPage section="FAQ" titre="FAQ" description="Questions fréquentes affichées sur le site public">
      <Suspense fallback={null}>
        <ContenuCrud<FaqEntree>
        endpoint="/admin/faq"
        colonnes={colonnes}
        champs={champs}
        cle={(f) => f.id}
        libelle="question"
        vide="Aucune question."
        versFormulaire={(f) => ({
          categorie: f.categorie,
          ordre: f.ordre,
          question: f.question,
          reponse: f.reponse,
          publiee: f.publiee,
        })}
        />
      </Suspense>
    </AdminPage>
  );
}
