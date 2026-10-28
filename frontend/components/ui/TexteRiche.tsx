import type { ReactNode } from "react";

/**
 * Text written in a back-office textarea, shown the way it was meant.
 *
 * Job adverts arrive as the recruiter typed them, and recruiters type in the
 * shape of a document: a heading with hashes, a bold label, a list with
 * dashes. The offer page printed all of it literally — "# FICHE DE POSTE",
 * "**Intitulé du poste :**", "- Assurer la saisie…" — several screens of it,
 * on the page a candidate reads before applying.
 *
 * A small, closed subset: headings, bold, and bullets. No HTML is ever
 * interpreted, so an advert cannot carry markup into the page; everything
 * else is left exactly as written.
 */

/** `**bold**` inside a line; the rest stays text. */
function enGras(ligne: string): ReactNode[] {
  return ligne.split(/(\*\*[^*]+\*\*)/g).map((morceau, i) =>
    morceau.startsWith("**") && morceau.endsWith("**") && morceau.length > 4 ? (
      <strong key={i} className="font-semibold text-[var(--sane-text)]">
        {morceau.slice(2, -2)}
      </strong>
    ) : (
      morceau
    )
  );
}

const TITRES: Record<number, string> = {
  1: "sane-h2 mt-6 mb-2 first:mt-0",
  2: "sane-h3 mt-5 mb-2 first:mt-0",
  3: "mt-4 mb-1.5 text-[14px] font-bold text-[var(--sane-text)] first:mt-0",
};

export function TexteRiche({ texte }: { texte: string }) {
  const lignes = texte.replace(/\r\n/g, "\n").split("\n");
  const blocs: ReactNode[] = [];

  // Consecutive "- " lines become one list; anything else closes it.
  let puces: string[] = [];

  function viderLesPuces() {
    if (puces.length === 0) return;

    blocs.push(
      <ul key={`l${blocs.length}`} className="mb-3 flex flex-col gap-1.5 pl-1">
        {puces.map((p, i) => (
          <li key={i} className="sane-body flex gap-2">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--sane-orange)]" />
            <span>{enGras(p)}</span>
          </li>
        ))}
      </ul>
    );

    puces = [];
  }

  for (const brute of lignes) {
    const ligne = brute.trim();

    if (ligne === "") {
      viderLesPuces();

      continue;
    }

    const puce = ligne.match(/^[-*•]\s+(.*)$/);

    if (puce) {
      puces.push(puce[1]);

      continue;
    }

    viderLesPuces();

    const titre = ligne.match(/^(#{1,3})\s+(.*)$/);

    if (titre) {
      const niveau = titre[1].length;
      const Balise = (niveau === 1 ? "h2" : niveau === 2 ? "h3" : "h4") as "h2" | "h3" | "h4";

      blocs.push(
        <Balise key={blocs.length} className={TITRES[niveau]}>
          {enGras(titre[2])}
        </Balise>
      );

      continue;
    }

    blocs.push(
      <p key={blocs.length} className="sane-body mb-3 last:mb-0">
        {enGras(ligne)}
      </p>
    );
  }

  viderLesPuces();

  return <>{blocs}</>;
}
