import type { Colonne } from "./AdminTable";

export interface ChampFormulaire {
  nom: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "date" | "time" | "url" | "email" | "tel" | "checkbox" | "image";
  options?: { value: string; label: string }[];
  requis?: boolean;
  pleineLargeur?: boolean;
  /** Example of what goes in, for a field whose label is not enough. */
  placeholder?: string;
  /** A line under the field explaining what it affects on the public site. */
  aide?: string;
  /** Rows for a textarea; the default is five. */
  lignes?: number;
  /**
   * What a new record starts with.
   *
   * Needed because the form used to open empty: a checkbox showed itself
   * unchecked, the key was never put in the payload, and the column default
   * decided instead. On four of the five lists that default is `true`, so
   * leaving "Publier" unticked published the record anyway.
   */
  defaut?: string | number | boolean;
  /** Heading this field starts, so a long form reads as a few short ones. */
  groupe?: string;
}

/**
 * Everything the list page and the form page need to know about one
 * editorial resource.
 *
 * Both routes import the same definition, which is why the columns an admin
 * sees and the fields they fill cannot fall out of step.
 */
export interface DefinitionRessource<T> {
  /** API collection, e.g. "/admin/actualites". */
  endpoint: string;
  /** Where the list lives, e.g. "/dashboard/admin/actualites". */
  base: string;
  /** Sidebar section to highlight; read from the URL when omitted. */
  section?: string;
  titre: string;
  description: string;
  /** Singular, lower case, with its article: "une actualité". */
  libelle: string;
  /** How the list page labels its add button: "Ajouter une actualité". */
  ajouter: string;
  /**
   * The collection an uploaded image belongs to — formateurs, partenaires,
   * actualites. Required by any resource declaring an "image" field, since
   * the upload endpoint is addressed by collection and record id.
   */
  typeImage?: string;
  vide: string;
  rechercheLabel?: string;
  colonnes: Colonne<T>[];
  champs: ChampFormulaire[];
  cle: (ligne: T) => number;
  /** Pre-fills the form when editing; omit a field to leave it blank. */
  versFormulaire: (ligne: T) => Record<string, unknown>;
  /** What to call one record in a heading or a confirmation. */
  nomDe: (ligne: T) => string;
}

/** A blank form, built from the declared fields so every key travels. */
export function formulaireVierge(champs: ChampFormulaire[]): Record<string, unknown> {
  return Object.fromEntries(
    champs.map((c) => [c.nom, c.defaut ?? (c.type === "checkbox" ? false : "")])
  );
}
