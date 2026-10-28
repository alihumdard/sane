export interface Speaker {
  name: string;
  title: string;
  org: string;
  tags: string[];
  img: string;
  /** Longer presentation, shown on the speaker's own page. */
  bio?: string;
}

/**
 * The speaker's address, derived from their name.
 *
 * Written-in speakers carry no identifier of their own, and the ones from the
 * administration should read the same way in the address bar, so both are
 * addressed by a slug of the name rather than by a number.
 */
export function slugIntervenant(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/*
 * The speakers themselves live in the database, entered from the back-office.
 * Eight invented names used to sit here — "M. Ibrahim Maiga", "Mme Aïssatou
 * Issa" — and the page showed them mixed in with the real ones the client had
 * added, with nothing to tell the two apart.
 */
export const ALL_SECTORS = "Tous les secteurs";

