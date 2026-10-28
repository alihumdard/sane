import type { Colonne } from "@/components/dashboard/AdminTable";
import type { ChampFormulaire, DefinitionRessource } from "@/components/dashboard/ressource";
import { Publie } from "@/components/dashboard/Publie";

export interface FaqEntree {
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
  { cle: "question", entete: "Question", rendu: (f) => <p className="font-semibold">{f.question}</p> },
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
    rendu: (f) => <Publie actif={f.publiee} oui="Publiée" non="Masquée" />,
  },
];

const champs: ChampFormulaire[] = [
  { nom: "categorie", label: "Catégorie", type: "select", options: CATEGORIES, requis: true },
  {
    nom: "ordre",
    label: "Ordre d'affichage",
    type: "number",
    aide: "Les plus petits nombres apparaissent en premier dans leur catégorie.",
  },
  { nom: "question", label: "Question", requis: true, pleineLargeur: true },
  { nom: "reponse", label: "Réponse", type: "textarea", lignes: 7, requis: true },
  { nom: "publiee", label: "Afficher cette question sur le site", type: "checkbox", defaut: true, pleineLargeur: true },
];

export const definition: DefinitionRessource<FaqEntree> = {
  endpoint: "/admin/faq",
  base: "/dashboard/admin/faq",
  titre: "FAQ",
  description: "Questions fréquentes affichées sur la page FAQ du site public.",
  libelle: "cette question",
  ajouter: "Ajouter une question",
  vide: "Aucune question pour le moment.",
  rechercheLabel: "Rechercher une question…",
  colonnes,
  champs,
  cle: (f) => f.id,
  nomDe: (f) => f.question,
  versFormulaire: (f) => ({
    categorie: f.categorie,
    ordre: f.ordre,
    question: f.question,
    reponse: f.reponse,
    publiee: f.publiee,
  }),
};
