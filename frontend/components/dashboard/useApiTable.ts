"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { PaginationMeta } from "@/lib/types";

interface Reponse<T> {
  data: T[];
  meta: PaginationMeta;
  resume?: Record<string, number>;
  filtres?: Record<string, unknown>;
}

interface Options {
  /** Exact-match filters, e.g. { statut: "publiee" }. */
  filtres?: Record<string, string>;
  perPage?: number;
}

/**
 * Server-backed table state: search, filters, sorting and pagination all
 * resolve in the API.
 *
 * It replaced a hook that sorted and filtered a static array in the browser,
 * which cannot work once a list outgrows one page. The query contract is the
 * one FiltreLesListes already reads.
 */
export function useApiTable<T>(endpoint: string, options: Options = {}) {
  const { filtres = {}, perPage = 15 } = options;

  const [lignes, setLignes] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [resume, setResume] = useState<Record<string, number>>({});
  const [filtresApi, setFiltresApi] = useState<Record<string, unknown>>({});

  const [recherche, setRecherche] = useState("");
  const [rechercheActive, setRechercheActive] = useState("");
  const [page, setPage] = useState(1);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  // Debounced so typing does not fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setRechercheActive(recherche);
      setPage(1);
    }, 350);

    return () => clearTimeout(t);
  }, [recherche]);

  const cleFiltres = JSON.stringify(filtres);

  /*
   * Back to the first page whenever the filters change.
   *
   * Narrowing a list from page 3 asked the API for a page that no longer
   * existed: it answered an empty set with last_page 1, the pagination hid
   * itself, and the admin was left looking at an empty table with nothing to
   * click.
   */
  const filtresPrecedents = useRef(cleFiltres);

  useEffect(() => {
    if (filtresPrecedents.current === cleFiltres) return;

    filtresPrecedents.current = cleFiltres;
    queueMicrotask(() => setPage(1));
  }, [cleFiltres]);

  // Guards against a slower earlier response overwriting a newer one.
  const jetonCourant = useRef(0);

  const charger = useCallback(async () => {
    const jeton = ++jetonCourant.current;

    try {
      setChargement(true);
      setErreur(null);

      const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
      if (rechercheActive) params.set("q", rechercheActive);

      for (const [cle, valeur] of Object.entries(JSON.parse(cleFiltres) as Record<string, string>)) {
        if (valeur) params.set(cle, valeur);
      }

      const res = await api.get<Reponse<T>>(`${endpoint}?${params}`);

      if (jeton !== jetonCourant.current) return;

      setLignes(res.data);
      setMeta(res.meta);
      setResume(res.resume ?? {});
      setFiltresApi(res.filtres ?? {});
    } catch (e) {
      if (jeton !== jetonCourant.current) return;

      setErreur(
        e instanceof ApiError ? e.message : "Impossible de charger les données."
      );
    } finally {
      if (jeton === jetonCourant.current) setChargement(false);
    }
  }, [endpoint, page, perPage, rechercheActive, cleFiltres]);

  useEffect(() => {
    // Deferred to a microtask so the first state update lands outside the
    // effect's synchronous body, avoiding a cascading render.
    void Promise.resolve().then(charger);
  }, [charger]);

  return {
    lignes,
    meta,
    resume,
    filtresApi,
    recherche,
    setRecherche,
    page,
    setPage,
    chargement,
    erreur,
    setErreur,
    recharger: charger,
  };
}
