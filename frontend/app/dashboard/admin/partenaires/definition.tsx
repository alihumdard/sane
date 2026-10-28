import type { Colonne } from "@/components/dashboard/AdminTable";
import type { ChampFormulaire, DefinitionRessource } from "@/components/dashboard/ressource";
import { Publie } from "@/components/dashboard/Publie";

export interface Partenaire {
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
        <p className={"text-[12px] text-[var(--sane-text-light)] " + (p.site_web ? "block" : "hidden")}>
          {p.site_web}
        </p>
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
    rendu: (p) => <Publie actif={p.publie} oui="Visible" non="Masqué" />,
  },
];

const champs: ChampFormulaire[] = [
  { nom: "nom", label: "Nom", requis: true },
  { nom: "type", label: "Type", type: "select", options: TYPES, requis: true },
  {
    nom: "logo",
    label: "Logo",
    type: "image",
    aide: "Sans logo, le partenaire s'affiche avec ses initiales sur une couleur de la charte.",
  },
  { nom: "site_web", label: "Site web", type: "url", placeholder: "https://…" },
  {
    nom: "ordre",
    label: "Ordre d'affichage",
    type: "number",
    aide: "Les plus petits nombres apparaissent en premier.",
  },
  { nom: "description", label: "Description", type: "textarea", lignes: 4 },
  { nom: "publie", label: "Afficher ce partenaire sur le site", type: "checkbox", defaut: true, pleineLargeur: true },
];

export const definition: DefinitionRessource<Partenaire> = {
  endpoint: "/admin/partenaires",
  base: "/dashboard/admin/partenaires",
  titre: "Partenaires",
  description: "Partenaires et sponsors affichés sur la page Partenaires et en pied de page.",
  libelle: "ce partenaire",
  ajouter: "Ajouter un partenaire",
  typeImage: "partenaires",
  vide: "Aucun partenaire pour le moment.",
  rechercheLabel: "Rechercher un partenaire…",
  colonnes,
  champs,
  cle: (p) => p.id,
  nomDe: (p) => p.nom,
  versFormulaire: (p) => ({
    nom: p.nom,
    type: p.type,
    logo: p.logo ?? "",
    site_web: p.site_web ?? "",
    ordre: p.ordre,
    description: p.description ?? "",
    publie: p.publie,
  }),
};
