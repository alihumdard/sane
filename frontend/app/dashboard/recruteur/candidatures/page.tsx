"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarPlus, Download, Loader2 } from "lucide-react";
import { ListeChargee } from "@/components/ui/ListeChargee";
import { Alerte } from "@/components/ui/Alerte";
import { Spinner, SpinnerOu } from "@/components/dashboard/Spinner";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { api, ApiError, telecharger } from "@/lib/api";
import type {
  ApiCandidature,
  ApiCreneau,
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
  const [message, setMessage] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<number | null>(null);

  // Free slots, so a candidate reaching the interview stage can be offered one
  // without leaving the page.
  const [creneaux, setCreneaux] = useState<ApiCreneau[]>([]);
  const [creneauChoisi, setCreneauChoisi] = useState<Record<number, string>>({});
  const [propose, setPropose] = useState<number | null>(null);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const params = filtre ? `?statut=${filtre}` : "";

      // Fetched together: the slots are only needed to fill the dropdowns on
      // rows that have reached the interview stage.
      const [res, cr] = await Promise.all([
        api.get<CandidaturesEntrepriseResponse>(`/entreprise/candidatures${params}`),
        api.get<{ data: ApiCreneau[] }>("/entreprise/creneaux"),
      ]);

      setCandidatures(res.data);
      setResume(res.resume);
      setCreneaux(cr.data.filter((c) => !c.reserve && !c.passe));
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

  /**
   * Offers one of the company's free slots to a candidate.
   *
   * The server mails the invitation and marks the slot taken, so the list is
   * reloaded afterwards: the slot must disappear from every other dropdown.
   */
  async function proposerEntretien(c: ApiCandidature) {
    const creneauId = creneauChoisi[c.id];

    if (!creneauId) return;

    setPropose(c.id);
    setErreur(null);
    setMessage(null);

    try {
      const res = await api.post<{ message: string }>(
        `/entreprise/candidatures/${c.id}/entretien`,
        { creneau_id: Number(creneauId) }
      );

      setMessage(res.message);
      setCreneauChoisi((choix) => ({ ...choix, [c.id]: "" }));
      await charger();
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Impossible de proposer ce créneau.");
    } finally {
      setPropose(null);
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

      <Alerte texte={message} ton="succes" className="mb-4" />
      <Alerte texte={erreur} className="mb-4" />

      {/*
        The list is never torn down to show progress. Advancing a stage reloads
        it, and swapping the whole subtree for a spinner each time is what kills
        the page under Google Translate — it keeps references into the rows it
        rewrote. Reloading only dims what is already there.
      */}
      <ListeChargee
        premierChargement={premierChargement}
        chargement={chargement}
        vide={candidatures.length === 0}
        messageVide={<>Aucune candidature {filtre ? "à cette étape" : ""}.</>}
      >
        <ul className="flex flex-col gap-3">
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

              {/*
                Shown once the candidate reaches the interview stage. Hidden
                rather than unmounted, like everything else that appears on a
                reload — Google Translate keeps references into this subtree.
              */}
              <div
                className={`mt-3 flex-wrap items-center gap-2 border-t border-[var(--sane-border)] pt-3 ${
                  c.statut === "entretien" ? "flex" : "hidden"
                }`}
              >
                <label htmlFor={`creneau-${c.id}`} className="text-[12px] text-[var(--sane-text-light)]">
                  Créneau :
                </label>

                <select
                  id={`creneau-${c.id}`}
                  value={creneauChoisi[c.id] ?? ""}
                  onChange={(e) =>
                    setCreneauChoisi((choix) => ({ ...choix, [c.id]: e.target.value }))
                  }
                  className="rounded-lg border border-[var(--sane-border)] px-2.5 py-1.5 text-[12px] outline-none focus:border-[var(--sane-green)]"
                >
                  <option value="">
                    {creneaux.length === 0 ? "Aucun créneau libre" : "Choisir un créneau…"}
                  </option>
                  {creneaux.map((cr) => (
                    <option key={cr.id} value={cr.id}>
                      {new Date(cr.debut).toLocaleString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" — "}
                      {cr.mode_label}
                      {cr.lieu ? ` · ${cr.lieu}` : ""}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => proposerEntretien(c)}
                  disabled={!creneauChoisi[c.id] || propose === c.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sane-green)] px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
                >
                  <SpinnerOu actif={propose === c.id} size={13}>
                    <CalendarPlus size={13} />
                  </SpinnerOu>
                  Proposer l&apos;entretien
                </button>

                <Link
                  href="/dashboard/recruteur/entretiens"
                  className="text-[12px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]"
                >
                  Gérer les créneaux →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </ListeChargee>
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
