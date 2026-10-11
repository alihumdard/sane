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
 * The existing useTable hook sorts and filters a static array in the browser,
 * which cannot work once a list outgrows one page — this is its API-backed
 * counterpart, matching the query contract FiltreLesListes already reads.
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
