import "server-only";

const BASE_URL =
  process.env.API_INTERNE ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/**
 * Reads the API while rendering, so the page reaches the visitor with its
 * content already in it.
 *
 * The speakers, the partners, the FAQ and the schedule moved out of the
 * source and into the database, and the pages fetched them from the browser
 * — which left the served HTML empty: nothing for a search engine, and a
 * blank page on a slow connection until the script ran and the call came
 * back.
 *
 * Uncached, like the offer and article pages: holding the response also
 * caches the rendered page, and one whose records have changed goes on
 * serving what it had.
 *
 * Returns the fallback rather than throwing — a section with nothing in it is
 * better than a page that will not render at all.
 */
export async function lireApi<T>(chemin: string, repli: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${chemin}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return repli;

    const charge = (await res.json()) as { data?: T };

    return charge.data ?? repli;
  } catch {
    return repli;
  }
}
