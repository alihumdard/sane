import type { Colonne } from "@/components/dashboard/AdminTable";
import type { ChampFormulaire, DefinitionRessource } from "@/components/dashboard/ressource";
import { Publie } from "@/components/dashboard/Publie";

export interface Actualite {
  id: number;
  titre: string;
  slug: string;
  categorie: string;
  extrait: string | null;
  contenu: string;
  image: string | null;
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
    rendu: (a) => <Publie actif={a.publiee} oui="Publiée" non="Brouillon" />,
  },
  { cle: "vues", entete: "Vues", masquer: "lg", rendu: (a) => a.vues },
];

const champs: ChampFormulaire[] = [
  { nom: "titre", label: "Titre", requis: true, pleineLargeur: true },
  { nom: "categorie", label: "Catégorie", type: "select", options: CATEGORIES, requis: true },
  { nom: "auteur", label: "Auteur", placeholder: "ex. Direction de la communication" },
  {
    nom: "extrait",
    label: "Extrait",
    type: "textarea",
    lignes: 3,
    aide: "Le résumé affiché sur la carte de l'article, dans la liste des actualités.",
  },
  {
    nom: "contenu",
    label: "Contenu",
    type: "textarea",
    lignes: 12,
    requis: true,
    aide: "Une ligne vide sépare deux paragraphes. **gras** et les listes commençant par « - » sont reconnus.",
  },
  { nom: "image", label: "Image de couverture", type: "image" },
  { nom: "publiee", label: "Publier cette actualité sur le site", type: "checkbox", pleineLargeur: true },
];

export const definition: DefinitionRessource<Actualite> = {
  endpoint: "/admin/actualites",
  base: "/dashboard/admin/actualites",
  titre: "Actualités",
  description: "Articles et communiqués affichés sur la page Actualités du site public.",
  libelle: "cette actualité",
  ajouter: "Ajouter une actualité",
  typeImage: "actualites",
  vide: "Aucune actualité pour le moment.",
  rechercheLabel: "Rechercher un titre, un auteur…",
  colonnes,
  champs,
  cle: (a) => a.id,
  nomDe: (a) => a.titre,
  versFormulaire: (a) => ({
    // Carried through, or the cover disappeared from the form the moment the
    // article was saved — invisible to look at and impossible to replace.
    image: a.image ?? "",
    titre: a.titre,
    categorie: a.categorie,
    auteur: a.auteur ?? "",
    extrait: a.extrait ?? "",
    contenu: a.contenu,
    publiee: a.publiee,
  }),
};
