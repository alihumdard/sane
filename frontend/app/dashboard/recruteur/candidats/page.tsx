"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Search, UserRound } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { api, ApiError } from "@/lib/api";
import type { ApiProfilDemandeur, CandidatsResponse } from "@/lib/types";

function Contenu() {
  const [profils, setProfils] = useState<ApiProfilDemandeur[]>([]);
  const [total, setTotal] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [active, setActive] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setActive(recherche), 350);

    return () => clearTimeout(t);
  }, [recherche]);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const params = active ? `?q=${encodeURIComponent(active)}` : "";
      const res = await api.get<CandidatsResponse>(`/entreprise/candidats${params}`);

      setProfils(res.data);
      setTotal(res.meta.total);
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Impossible de charger les profils.");
    } finally {
      setChargement(false);
    }
  }, [active]);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  return (
    <>
      <div className="relative mb-5 max-w-[420px]">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sane-text-light)]" />
        <input
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Poste, compétence…"
          aria-label="Rechercher un profil"
          className="h-[44px] w-full rounded-xl border border-[var(--sane-border)] bg-white pl-10 pr-4 text-[13px] outline-none focus:border-[var(--sane-green)]"
        />
      </div>

      <p className="mb-4 text-[13px] text-[var(--sane-text-light)]">
        {chargement ? "Recherche…" : `${total} profil(s) disponible(s)`}
      </p>

      <Alerte texte={erreur} className="mb-4" />

      {!chargement && profils.length === 0 && !erreur && (
        <p className="rounded-2xl border border-[var(--sane-border)] bg-white py-12 text-center text-[13px] text-[var(--sane-text-light)]">
          Aucun profil ne correspond à votre recherche.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profils.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/recruteur/candidats/${p.id}`}
            className="block rounded-2xl border border-[var(--sane-border)] bg-white p-5 transition-colors hover:border-[var(--sane-green)]"
          >
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--sane-green-light)] text-[var(--sane-green)]">
              <UserRound size={20} />
            </span>

            <h2 className="text-[14px] font-bold text-[var(--sane-text)]">{p.nom ?? "Candidat"}</h2>
            <p className="mb-2 text-[12px] text-[var(--sane-text-light)]">{p.titre_pro ?? "—"}</p>

            {p.ville && (
              <p className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-[var(--sane-text-light)]">
                <MapPin size={12} /> {p.ville}
              </p>
            )}

            {p.competences && p.competences.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {p.competences.slice(0, 4).map((c) => (
                  <li
                    key={c.id}
                    className="rounded-full bg-[var(--sane-background)] px-2.5 py-1 text-[11px] text-[var(--sane-text)]"
                  >
                    {c.nom}
                  </li>
                ))}
              </ul>
            )}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-[12px] text-[var(--sane-text-light)]">
        Seuls les profils rendus visibles par leur titulaire apparaissent ici. Les coordonnées
        deviennent accessibles lorsqu&apos;un candidat postule à l&apos;une de vos offres.
      </p>
    </>
  );
}

export default function CandidatsRecruteurPage() {
  return (
    <RecruteurLayout titre="Rechercher des profils" description="Parcourez les candidats disponibles">
      <Contenu />
    </RecruteurLayout>
  );
}
