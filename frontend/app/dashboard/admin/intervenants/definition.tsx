import { Mail, Phone } from "lucide-react";
import type { Colonne } from "@/components/dashboard/AdminTable";
import type { ChampFormulaire, DefinitionRessource } from "@/components/dashboard/ressource";
import type { ApiFormateur } from "@/lib/types";
import { REPLI } from "@/lib/referentiels";

const colonnes: Colonne<ApiFormateur>[] = [
  {
    cle: "nom",
    entete: "Intervenant",
    rendu: (f) => (
      <>
        <p className="font-semibold">{f.nom}</p>
        <p className="text-[12px] text-[var(--sane-text-light)]">{f.fonction ?? "—"}</p>
      </>
    ),
  },
  { cle: "organisation", entete: "Organisation", masquer: "sm", rendu: (f) => f.organisation ?? "—" },
  {
    cle: "contact",
    entete: "Contact",
    masquer: "md",
    rendu: (f) => (
      <div className="flex flex-col gap-0.5 text-[12px]">
        <span className={"items-center gap-1.5 " + (f.email ? "inline-flex" : "hidden")}>
          <Mail size={12} className="shrink-0 text-[var(--sane-text-light)]" /> {f.email}
        </span>
        <span className={"items-center gap-1.5 " + (f.telephone ? "inline-flex" : "hidden")}>
          <Phone size={12} className="shrink-0 text-[var(--sane-text-light)]" /> {f.telephone}
        </span>
        <span className={"text-[var(--sane-text-light)] " + (!f.email && !f.telephone ? "inline" : "hidden")}>—</span>
      </div>
    ),
  },
  {
    cle: "formations",
    entete: "Formations",
    masquer: "lg",
    rendu: (f) => (
      <span
        className={
          "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-semibold " +
          (f.formations_count > 0
            ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
            : "bg-[var(--sane-background)] text-[var(--sane-text-light)]")
        }
      >
        {f.formations_count}
      </span>
    ),
  },
];

const champs: ChampFormulaire[] = [
  { nom: "nom", label: "Nom complet", requis: true, placeholder: "ex. Amadou Issoufou" },
  { nom: "fonction", label: "Fonction", placeholder: "ex. Directeur des ressources humaines" },
  { nom: "organisation", label: "Organisation", pleineLargeur: true },
  {
    nom: "secteur",
    label: "Secteur",
    type: "select",
    options: REPLI.secteur.map((s) => ({ value: s, label: s })),
    aide: "Sert de filtre sur la page publique Intervenants.",
  },
  { nom: "email", label: "Email", type: "email" },
  { nom: "telephone", label: "Téléphone", type: "tel" },
  { nom: "photo", label: "Photo", type: "image" },
  {
    nom: "bio",
    label: "Biographie",
    type: "textarea",
    lignes: 7,
    aide: "Affichée sur la fiche publique de l'intervenant.",
  },
];

export const definition: DefinitionRessource<ApiFormateur> = {
  endpoint: "/admin/formateurs",
  base: "/dashboard/admin/intervenants",
  titre: "Intervenants",
  description: "Formateurs et intervenants affichés sur le site et affectables à une formation.",
  libelle: "cet intervenant",
  ajouter: "Ajouter un intervenant",
  typeImage: "formateurs",
  vide: "Aucun intervenant. Ajoutez-en un pour l'affecter à une formation.",
  rechercheLabel: "Rechercher un nom, une organisation…",
  colonnes,
  champs,
  cle: (f) => f.id,
  nomDe: (f) => f.nom,
  versFormulaire: (f) => ({
    nom: f.nom,
    fonction: f.fonction ?? "",
    organisation: f.organisation ?? "",
    secteur: f.secteur ?? "",
    email: f.email ?? "",
    telephone: f.telephone ?? "",
    photo: f.photo ?? "",
    bio: f.bio ?? "",
  }),
};
