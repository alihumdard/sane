import type { Colonne } from "@/components/dashboard/AdminTable";
import type { ChampFormulaire, DefinitionRessource } from "@/components/dashboard/ressource";
import { Publie } from "@/components/dashboard/Publie";

export interface ArticlePresse {
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
    rendu: (a) => <Publie actif={a.publie} oui="Visible" non="Masqué" />,
  },
];

const champs: ChampFormulaire[] = [
  { nom: "titre", label: "Titre", requis: true, pleineLargeur: true },
  { nom: "media", label: "Média", requis: true, placeholder: "ex. Le Sahel, RTN, ANP" },
  { nom: "type", label: "Type", type: "select", options: TYPES, requis: true },
  { nom: "date_publication", label: "Date de publication", type: "date", requis: true },
  {
    nom: "lien",
    label: "Lien vers l'article",
    type: "url",
    placeholder: "https://…",
    aide: "Sans lien, le titre s'affiche sans bouton « Lire l'article ».",
  },
  { nom: "resume", label: "Résumé", type: "textarea", lignes: 4 },
  { nom: "publie", label: "Afficher cet élément sur le site", type: "checkbox", defaut: true, pleineLargeur: true },
];

export const definition: DefinitionRessource<ArticlePresse> = {
  endpoint: "/admin/presse",
  base: "/dashboard/admin/presse",
  titre: "Espace presse",
  description: "Communiqués, dossiers et couverture médiatique affichés sur la page Presse.",
  libelle: "cet élément",
  ajouter: "Ajouter un élément",
  vide: "Aucun élément pour le moment.",
  rechercheLabel: "Rechercher un titre, un média…",
  colonnes,
  champs,
  cle: (a) => a.id,
  nomDe: (a) => a.titre,
  versFormulaire: (a) => ({
    titre: a.titre,
    media: a.media,
    type: a.type,
    date_publication: a.date_publication?.slice(0, 10),
    lien: a.lien ?? "",
    resume: a.resume ?? "",
    publie: a.publie,
  }),
};
