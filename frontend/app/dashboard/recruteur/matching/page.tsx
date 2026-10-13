"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2, RefreshCw, Sparkles, UserRound } from "lucide-react";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { ScoreBadge } from "@/components/recruteur/ScoreBadge";
import { api, ApiError } from "@/lib/api";
import type {
  ApiCorrespondance,
  ApiOffre,
  CorrespondancesResponse,
  OffresEntrepriseResponse,
} from "@/lib/types";

function Contenu() {
  const [offres, setOffres] = useState<ApiOffre[]>([]);
  const [offreId, setOffreId] = useState<number | null>(null);
  const [correspondances, setCorrespondances] = useState<ApiCorrespondance[]>([]);
  const [chargement, setChargement] = useState(true);
  const [recalcul, setRecalcul] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Offers first — matching is always read in the context of one offer.
  useEffect(() => {
    let actif = true;

    api
      .get<OffresEntrepriseResponse>("/entreprise/offres")
      .then((res) => {
        if (!actif) return;
        setOffres(res.data);
        setOffreId(res.data[0]?.id ?? null);
      })
      .catch((e) => actif && setErreur(e instanceof ApiError ? e.message : "Chargement impossible."))
      .finally(() => actif && setChargement(false));

    return () => {
      actif = false;
    };
  }, []);

  const charger = useCallback(async () => {
    if (!offreId) return;

    try {
      setChargement(true);
      setErreur(null);

      const res = await api.get<CorrespondancesResponse>(`/entreprise/offres/${offreId}/matching`);
      setCorrespondances(res.data);
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Impossible de charger les correspondances.");
    } finally {
      setChargement(false);
    }
  }, [offreId]);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  async function recalculer() {
    if (!offreId) return;

    setRecalcul(true);
    setMessage(null);
    setErreur(null);

    try {
      const res = await api.post<{ message: string }>(`/entreprise/offres/${offreId}/matching/recalculer`);
      setMessage(res.message);
      await charger();
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Recalcul impossible.");
    } finally {
      setRecalcul(false);
    }
  }

  if (offres.length === 0 && !chargement) {
    return (
      <p className="rounded-2xl border border-[var(--sane-border)] bg-white py-12 text-center text-[13px] text-[var(--sane-text-light)]">
        Créez d&apos;abord une offre pour voir les candidats correspondants.
      </p>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-[240px] flex-1">
          <label htmlFor="offre" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
            Offre
          </label>
          <select
            id="offre"
            value={offreId ?? ""}
            onChange={(e) => setOffreId(Number(e.target.value))}
            className="w-full max-w-[420px] rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[var(--sane-green)]"
          >
            {offres.map((o) => (
              <option key={o.id} value={o.id}>
                {o.titre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={recalculer}
          disabled={recalcul || !offreId}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--sane-border)] px-4 py-2.5 text-[13px] font-semibold hover:border-[var(--sane-green)] disabled:opacity-60"
        >
          <SpinnerOu actif={recalcul}><RefreshCw size={15} /></SpinnerOu>
          Recalculer
        </button>
      </div>

      {message && (
        <p role="status" className="mb-4 rounded-xl bg-[var(--sane-green-light)] p-3 text-[13px] text-[var(--sane-green)]">
          {message}
        </p>
      )}

      {erreur && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] p-4">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
          <span className="text-[13px] text-[var(--sane-red-dark)]">{erreur}</span>
        </p>
      )}

      {chargement ? (
        <p className="flex items-center gap-2 py-10">
          <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
          <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
        </p>
      ) : correspondances.length === 0 ? (
        <div className="rounded-2xl border border-[var(--sane-border)] bg-white py-12 text-center">
          <Sparkles size={26} className="mx-auto mb-3 text-[var(--sane-text-light)]" />
          <p className="text-[13px] text-[var(--sane-text-light)]">
            Aucun candidat correspondant pour l&apos;instant. Lancez un recalcul après avoir
            modifié l&apos;offre.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {correspondances.map((c) => (
            <li key={c.id} className="rounded-2xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--sane-green-light)] text-[var(--sane-green)]">
                    <UserRound size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[var(--sane-text)]">
                      {c.profil?.nom ?? "Candidat"}
                    </p>
                    <p className="text-[12px] text-[var(--sane-text-light)]">
                      {c.profil?.titre_pro ?? "—"}
                      {c.profil?.ville && ` · ${c.profil.ville}`}
                    </p>
                  </div>
                </div>

                <ScoreBadge score={c.score} />
              </div>

              {/* The breakdown is the point of criteria-based matching: the
                  recruiter sees why this candidate ranked where they did. */}
              <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {Object.entries(c.details).map(([critere, d]) => (
                  <li key={critere} className="flex items-center gap-2 text-[12px]">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        d.obtenu === d.max
                          ? "bg-[var(--sane-green)]"
                          : d.obtenu > 0
                            ? "bg-[var(--sane-orange)]"
                            : "bg-[var(--sane-border)]"
                      }`}
                    />
                    <span className="text-[var(--sane-text-light)]">{d.raison}</span>
                    <span className="ml-auto shrink-0 font-semibold text-[var(--sane-text)]">
                      {d.obtenu}/{d.max}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function MatchingPage() {
  return (
    <RoleGuard roles={["recruteur", "entreprise"]} espace="l'espace recruteur">
      <RecruteurLayout
        titre="Candidats correspondants"
        description="Classement par critères, avec le détail du score"
      >
        <Contenu />
      </RecruteurLayout>
    </RoleGuard>
  );
}
