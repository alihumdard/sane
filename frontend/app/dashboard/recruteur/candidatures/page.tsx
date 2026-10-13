"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { Spinner } from "@/components/dashboard/Spinner";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { api, ApiError, telecharger } from "@/lib/api";
import type {
  ApiCandidature,
  CandidaturesEntrepriseResponse,
  StatutCandidature,
} from "@/lib/types";

const ETAPES: { value: StatutCandidature; label: string }[] = [
  { value: "envoyee", label: "Envoyée" },
  { value: "en_revue", label: "En revue" },
  { value: "preselectionnee", label: "Présélectionnée" },
  { value: "entretien", label: "Entretien" },
  { value: "acceptee", label: "Acceptée" },
  { value: "refusee", label: "Refusée" },
];

function Contenu() {
  const [candidatures, setCandidatures] = useState<ApiCandidature[]>([]);
  const [resume, setResume] = useState<Record<string, number>>({});
  const [filtre, setFiltre] = useState<string>("");
  const [chargement, setChargement] = useState(true);
  // Distinguishes "nothing on screen yet" from "refreshing what is shown":
  // only the first needs the page to wait.
  const [premierChargement, setPremierChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<number | null>(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const params = filtre ? `?statut=${filtre}` : "";
      const res = await api.get<CandidaturesEntrepriseResponse>(`/entreprise/candidatures${params}`);

      setCandidatures(res.data);
      setResume(res.resume);
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Impossible de charger les candidatures.");
    } finally {
      setChargement(false);
      setPremierChargement(false);
    }
  }, [filtre]);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  async function changerStatut(c: ApiCandidature, statut: StatutCandidature) {
    setEnCours(c.id);

    try {
      await api.put(`/entreprise/candidatures/${c.id}/statut`, { statut });
      await charger();
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Changement de statut impossible.");
    } finally {
      setEnCours(null);
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltre("")}
          className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
            filtre === "" ? "bg-[var(--sane-green)] text-white" : "bg-white text-[var(--sane-text)]"
          }`}
        >
          Toutes ({resume.total ?? 0})
        </button>
        {ETAPES.map((e) => (
          <button
            key={e.value}
            type="button"
            onClick={() => setFiltre(e.value)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
              filtre === e.value ? "bg-[var(--sane-green)] text-white" : "bg-white text-[var(--sane-text)]"
            }`}
          >
            {e.label} ({resume[e.value] ?? 0})
          </button>
        ))}
      </div>

      <Alerte texte={erreur} className="mb-4" />

      {/*
        The list is never torn down to show progress. Advancing a stage reloads
        it, and swapping the whole subtree for a spinner each time is what kills
        the page under Google Translate — it keeps references into the rows it
        rewrote. Reloading only dims what is already there.
      */}
      <p className={`items-center gap-2 py-10 ${premierChargement ? "flex" : "hidden"}`}>
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
      </p>

      <p
        className={`rounded-2xl border border-[var(--sane-border)] bg-white py-12 text-center text-[13px] text-[var(--sane-text-light)] ${
          !premierChargement && candidatures.length === 0 ? "block" : "hidden"
        }`}
      >
        Aucune candidature {filtre ? "à cette étape" : ""}.
      </p>

      {(
        <ul
          aria-busy={chargement}
          className={`flex-col gap-3 transition-opacity ${chargement ? "opacity-50" : ""} ${
            candidatures.length > 0 ? "flex" : "hidden"
          }`}
        >
          {candidatures.map((c) => (
            <li key={c.id} className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[var(--sane-text)]">
                    {c.profil?.nom ?? "Candidat"}
                  </p>
                  <p className="text-[12px] text-[var(--sane-text-light)]">
                    {c.profil?.titre_pro ?? "—"} · {c.offre?.titre}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--sane-text-light)]">
                    Réf. {c.reference}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!c.cv}
                  onClick={() => c.cv && telecharger(`/entreprise/candidatures/${c.id}/cv`, c.cv.nom_original)}
                  className={`items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-3 py-1.5 text-[12px] font-semibold hover:border-[var(--sane-green)] ${c.cv ? "inline-flex" : "hidden"}`}
                >
                  <Download size={13} /> CV
                </button>
              </div>

              <p className={`mb-3 rounded-lg bg-[var(--sane-background)] p-3 text-[12px] text-[var(--sane-text)] ${c.lettre_motivation ? "block" : "hidden"}`}>
                {c.lettre_motivation}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-[var(--sane-text-light)]">Étape :</span>
                {ETAPES.map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    disabled={enCours === c.id || c.statut === e.value}
                    onClick={() => changerStatut(c, e.value)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      c.statut === e.value
                        ? "bg-[var(--sane-green)] text-white"
                        : "bg-[var(--sane-background)] text-[var(--sane-text-light)] hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)]"
                    } disabled:cursor-default`}
                  >
                    {e.label}
                  </button>
                ))}
                <Spinner actif={enCours === c.id} size={13} className="text-[var(--sane-green)]" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function CandidaturesRecruteurPage() {
  return (
    <RoleGuard roles={["recruteur", "entreprise"]} espace="l'espace recruteur">
      <RecruteurLayout titre="Candidatures" description="Suivez et faites avancer vos recrutements">
        <Contenu />
      </RecruteurLayout>
    </RoleGuard>
  );
}
