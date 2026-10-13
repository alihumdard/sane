"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CalendarPlus, Loader2, Trash2, Video } from "lucide-react";
import { ListeChargee } from "@/components/ui/ListeChargee";
import { Alerte } from "@/components/ui/Alerte";
import { SpinnerOu } from "@/components/dashboard/Spinner";
import { RoleGuard } from "@/components/dashboard/RoleGuard";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { api, ApiError } from "@/lib/api";
import type { ApiCreneau, ApiEntretien, EntretiensResponse, ModeEntretien } from "@/lib/types";

function formatCreneau(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const COULEUR: Record<string, string> = {
  en_attente: "bg-[#fff8ed] text-[var(--sane-orange)]",
  confirme: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  termine: "bg-[var(--sane-background)] text-[var(--sane-text-light)]",
  annule: "bg-[#fdf1f1] text-[var(--sane-red-dark)]",
};

function Contenu() {
  const [entretiens, setEntretiens] = useState<ApiEntretien[]>([]);
  const [creneaux, setCreneaux] = useState<ApiCreneau[]>([]);
  const [chargement, setChargement] = useState(true);
  // Distinguishes "nothing on screen yet" from "refreshing what is shown":
  // only the first needs the list to be absent.
  const [premierChargement, setPremierChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [nouveau, setNouveau] = useState({ debut: "", fin: "", mode: "visio" as ModeEntretien, lieu: "" });
  const [ajout, setAjout] = useState(false);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const [e, c] = await Promise.all([
        api.get<EntretiensResponse>("/entreprise/entretiens"),
        api.get<{ data: ApiCreneau[] }>("/entreprise/creneaux"),
      ]);

      setEntretiens(e.data);
      setCreneaux(c.data);
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Chargement impossible.");
    } finally {
      setChargement(false);
      setPremierChargement(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  async function ajouterCreneau(e: React.FormEvent) {
    e.preventDefault();
    setAjout(true);
    setErreur(null);

    try {
      await api.post("/entreprise/creneaux", {
        debut: nouveau.debut.replace("T", " ") + ":00",
        fin: nouveau.fin.replace("T", " ") + ":00",
        mode: nouveau.mode,
        lieu: nouveau.lieu || undefined,
      });
      setNouveau({ debut: "", fin: "", mode: "visio", lieu: "" });
      await charger();
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? (err.fieldError("debut") ?? err.fieldError("lieu") ?? err.message)
          : "Impossible d'ajouter le créneau."
      );
    } finally {
      setAjout(false);
    }
  }

  async function supprimerCreneau(id: number) {
    try {
      await api.delete(`/entreprise/creneaux/${id}`);
      await charger();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Suppression impossible.");
    }
  }

  async function action(entretien: ApiEntretien, quoi: "annuler" | "terminer") {
    try {
      await api.post(`/entreprise/entretiens/${entretien.id}/${quoi}`);
      await charger();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Action impossible.");
    }
  }

  return (
    <>
      <Alerte texte={erreur} className="mb-4" />

      <section className="mb-6 rounded-2xl border border-[var(--sane-border)] bg-white p-5">
        <h2 className="mb-4 text-[15px] font-bold text-[var(--sane-text)]">Ajouter un créneau</h2>

        <form onSubmit={ajouterCreneau} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="debut" className="mb-1 block text-[12px] font-semibold">Début</label>
            <input
              id="debut" type="datetime-local" required value={nouveau.debut}
              onChange={(e) => setNouveau((n) => ({ ...n, debut: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
          <div>
            <label htmlFor="fin" className="mb-1 block text-[12px] font-semibold">Fin</label>
            <input
              id="fin" type="datetime-local" required value={nouveau.fin}
              onChange={(e) => setNouveau((n) => ({ ...n, fin: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
          <div>
            <label htmlFor="mode" className="mb-1 block text-[12px] font-semibold">Mode</label>
            <select
              id="mode" value={nouveau.mode}
              onChange={(e) => setNouveau((n) => ({ ...n, mode: e.target.value as ModeEntretien }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
            >
              <option value="visio">Visioconférence</option>
              <option value="presentiel">Présentiel</option>
              <option value="telephone">Téléphone</option>
            </select>
          </div>
          <div>
            <label htmlFor="lieu" className="mb-1 block text-[12px] font-semibold">
              Lieu {nouveau.mode === "presentiel" && "*"}
            </label>
            <input
              id="lieu" value={nouveau.lieu}
              required={nouveau.mode === "presentiel"}
              onChange={(e) => setNouveau((n) => ({ ...n, lieu: e.target.value }))}
              className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
            />
          </div>
          <button
            type="submit" disabled={ajout}
            className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-[var(--sane-orange)] px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
          >
            <SpinnerOu actif={ajout}><CalendarPlus size={15} /></SpinnerOu>
            Ajouter
          </button>
        </form>

        {creneaux.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {creneaux.map((c) => (
              <li
                key={c.id}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] ${
                  c.reserve ? "border-[var(--sane-green)] bg-[var(--sane-green-light)]" : "border-[var(--sane-border)]"
                }`}
              >
                <span>{formatCreneau(c.debut)} · {c.mode_label}</span>
                {c.reserve ? (
                  <span className="font-semibold text-[var(--sane-green)]">réservé</span>
                ) : (
                  <button type="button" onClick={() => supprimerCreneau(c.id)} title="Supprimer" className="text-[var(--sane-red-dark)]">
                    <Trash2 size={13} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <h2 className="mb-3 text-[15px] font-bold text-[var(--sane-text)]">Entretiens planifiés</h2>

      <ListeChargee
        premierChargement={premierChargement}
        chargement={chargement}
        vide={entretiens.length === 0}
        messageVide={
          <p className="rounded-2xl border border-[var(--sane-border)] bg-white py-10 text-center text-[13px] text-[var(--sane-text-light)]">
          Aucun entretien planifié. Proposez un créneau depuis une candidature.
        </p>
        }
      >
        <ul className="flex flex-col gap-3">
          {entretiens.map((e) => (
            <li key={e.id} className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[var(--sane-text)]">
                    {e.candidature?.profil?.nom ?? "Candidat"}
                  </p>
                  <p className="text-[12px] text-[var(--sane-text-light)]">
                    {e.candidature?.offre?.titre}
                  </p>
                  {e.creneau && (
                    <p className="mt-1 text-[12px] text-[var(--sane-text)]">
                      {formatCreneau(e.creneau.debut)} · {e.creneau.mode_label}
                      {e.creneau.lieu && ` — ${e.creneau.lieu}`}
                    </p>
                  )}
                  {e.lien_visio && (
                    <a href={e.lien_visio} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--sane-green)]">
                      <Video size={12} /> Rejoindre
                    </a>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${COULEUR[e.statut]}`}>
                    {e.statut_label}
                  </span>

                  {!e.est_final && (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => action(e, "terminer")} className="text-[12px] font-semibold text-[var(--sane-green)]">
                        Terminer
                      </button>
                      <button type="button" onClick={() => action(e, "annuler")} className="text-[12px] font-semibold text-[var(--sane-red-dark)]">
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ListeChargee>
    </>
  );
}

export default function EntretiensRecruteurPage() {
  return (
    <RoleGuard roles={["recruteur", "entreprise"]} espace="l'espace recruteur">
      <RecruteurLayout titre="Entretiens" description="Créneaux disponibles et entretiens planifiés">
        <Contenu />
      </RecruteurLayout>
    </RoleGuard>
  );
}
