"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, CalendarDays, CheckCircle2, Lock, MapPin, Pencil, Plus, Trash2, Unlock, X,
} from "lucide-react";
import { ListeChargee } from "@/components/ui/ListeChargee";
import { Alerte } from "@/components/ui/Alerte";
import { Spinner } from "@/components/dashboard/Spinner";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { api, ApiError } from "@/lib/api";
import { DialogueConfirmation } from "@/components/dashboard/DialogueConfirmation";
import type { ApiEdition, EditionPayload } from "@/lib/types";

const champ =
  "w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10";
const etiquette = "mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const vide: EditionPayload = {
  annee: new Date().getFullYear(),
  nom: "",
  date_debut: "",
  date_fin: "",
  lieu: "",
  active: false,
  inscriptions_ouvertes: false,
};

function Contenu() {
  const [aSupprimer, setASupprimer] = useState<ApiEdition | null>(null);
  // The sidebar's "Ajouter un événement" entry links here with ?nouveau=1, so
  // the link opens the form rather than merely landing on the list.
  const params = useSearchParams();

  const [editions, setEditions] = useState<ApiEdition[]>([]);
  const [chargement, setChargement] = useState(true);
  // Distinguishes "nothing on screen yet" from "refreshing what is shown":
  // only the first needs the list to be absent.
  const [premierChargement, setPremierChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<number | null>(null);

  const [edition, setEdition] = useState<ApiEdition | "nouvelle" | null>(null);
  const [form, setForm] = useState<EditionPayload>(vide);
  const [envoi, setEnvoi] = useState(false);
  const [champsEnErreur, setChampsEnErreur] = useState<Record<string, string>>({});

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const res = await api.get<{ data: ApiEdition[] }>("/admin/editions");
      setEditions(res.data);
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Impossible de charger les éditions.");
    } finally {
      setChargement(false);
      setPremierChargement(false);
    }
  }, []);

  useEffect(() => {
    // Deferred to a microtask so the first state update lands outside the
    // effect's synchronous body, avoiding a cascading render.
    void Promise.resolve().then(charger);
  }, [charger]);

  useEffect(() => {
    if (params.get("nouveau")) {
      void Promise.resolve().then(() => ouvrir("nouvelle"));
    }
  }, [params]);

  function ouvrir(e: ApiEdition | "nouvelle") {
    setEdition(e);
    setChampsEnErreur({});
    setForm(
      e === "nouvelle"
        ? vide
        : {
            annee: e.annee,
            nom: e.nom,
            date_debut: e.date_debut,
            date_fin: e.date_fin,
            lieu: e.lieu ?? "",
            active: e.active,
            inscriptions_ouvertes: e.inscriptions_ouvertes,
          }
    );
  }

  async function enregistrer(ev: React.FormEvent) {
    ev.preventDefault();
    setEnvoi(true);
    setChampsEnErreur({});
    setErreur(null);

    try {
      const res =
        edition === "nouvelle"
          ? await api.post<{ message: string }>("/admin/editions", form)
          : await api.put<{ message: string }>(`/admin/editions/${(edition as ApiEdition).id}`, form);

      setMessage(res.message);
      setEdition(null);
      await charger();
    } catch (e) {
      if (e instanceof ApiError) {
        setErreur(e.message);
        setChampsEnErreur(Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v[0]])));
      } else {
        setErreur("Enregistrement impossible.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  async function action(e: ApiEdition, quoi: "activer" | "inscriptions") {
    setEnCours(e.id);
    setErreur(null);

    try {
      const res = await api.put<{ message: string }>(`/admin/editions/${e.id}/${quoi}`);
      setMessage(res.message);
      await charger();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Action impossible.");
    } finally {
      setEnCours(null);
    }
  }

  async function supprimer() {
    const e = aSupprimer;

    if (!e) return;

    setASupprimer(null);
    setEnCours(e.id);
    setErreur(null);

    try {
      const res = await api.delete<{ message: string }>(`/admin/editions/${e.id}`);
      setMessage(res.message);
      await charger();
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : "Suppression impossible.");
    } finally {
      setEnCours(null);
    }
  }

  if (edition !== null) {
    return (
      <form onSubmit={enregistrer} className="max-w-[680px] rounded-2xl border border-[var(--sane-border)] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[var(--sane-text)]">
            {edition === "nouvelle" ? "Nouvelle édition" : `Modifier l'édition ${(edition as ApiEdition).annee}`}
          </h2>
          <button type="button" onClick={() => setEdition(null)} aria-label="Fermer" className="rounded-lg p-2 hover:bg-[var(--sane-background)]">
            <X size={16} />
          </button>
        </div>

        <Alerte texte={erreur} className="mb-4" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="annee" className={etiquette}>Année *</label>
            <input
              id="annee" type="number" required min={2020} max={2100}
              value={form.annee}
              onChange={(e) => setForm((f) => ({ ...f, annee: Number(e.target.value) }))}
              className={champ}
            />
            {champsEnErreur.annee && <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{champsEnErreur.annee}</p>}
          </div>

          <div>
            <label htmlFor="lieu" className={etiquette}>Lieu</label>
            <input
              id="lieu" value={form.lieu ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, lieu: e.target.value }))}
              className={champ}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="nom" className={etiquette}>Nom de l&apos;événement *</label>
            <input
              id="nom" required value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              className={champ}
            />
            {champsEnErreur.nom && <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{champsEnErreur.nom}</p>}
          </div>

          <div>
            <label htmlFor="date_debut" className={etiquette}>Date de début *</label>
            <input
              id="date_debut" type="date" required value={form.date_debut}
              onChange={(e) => setForm((f) => ({ ...f, date_debut: e.target.value }))}
              className={champ}
            />
            {champsEnErreur.date_debut && <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{champsEnErreur.date_debut}</p>}
          </div>

          <div>
            <label htmlFor="date_fin" className={etiquette}>Date de fin *</label>
            <input
              id="date_fin" type="date" required value={form.date_fin}
              onChange={(e) => setForm((f) => ({ ...f, date_fin: e.target.value }))}
              className={champ}
            />
            {champsEnErreur.date_fin && <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{champsEnErreur.date_fin}</p>}
          </div>

          <label className="flex items-start gap-2.5 rounded-xl bg-[var(--sane-background)] p-3 sm:col-span-2">
            <input
              type="checkbox" checked={Boolean(form.active)}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-[var(--sane-green)]"
            />
            <span className="text-[13px]">
              <strong>Édition active.</strong> Les inscriptions et les formations du site public
              portent sur cette édition. Une seule peut être active à la fois.
            </span>
          </label>

          <label className="flex items-start gap-2.5 rounded-xl bg-[var(--sane-background)] p-3 sm:col-span-2">
            <input
              type="checkbox" checked={Boolean(form.inscriptions_ouvertes)}
              onChange={(e) => setForm((f) => ({ ...f, inscriptions_ouvertes: e.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-[var(--sane-green)]"
            />
            <span className="text-[13px]">
              <strong>Inscriptions ouvertes.</strong> Décochez pour fermer le formulaire
              d&apos;inscription du site public.
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--sane-border)] pt-5">
        <button
          type="submit" disabled={envoi}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--sane-orange)] px-5 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
        >
          <Spinner actif={envoi} />
          Enregistrer
        </button>

        {/*
          A way out that is not a small cross in the corner: leaving the form
          meant finding the X, and nothing said what it would do with what had
          been typed.
        */}
        <button
          type="button"
          onClick={() => setEdition(null)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--sane-border)] px-4 py-2.5 text-[13px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]"
        >
          <ArrowLeft size={15} /> Retour aux éditions
        </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <DialogueConfirmation
        ouvert={aSupprimer !== null}
        titre="Supprimer cette édition ?"
        message={`L'édition ${aSupprimer?.annee ?? ""} et tout ce qui lui est rattaché seront retirés. Cette action est définitive.`}
        enCours={enCours === aSupprimer?.id}
        onConfirmer={supprimer}
        onAnnuler={() => setASupprimer(null)}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-[var(--sane-text-light)]">
          {editions.length} édition(s). L&apos;édition active porte les inscriptions du site public.
        </p>
        <button
          type="button"
          onClick={() => ouvrir("nouvelle")}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[13px] font-bold text-white"
        >
          <Plus size={15} /> Nouvelle édition
        </button>
      </div>

      <Alerte texte={message} ton="succes" className="mb-4" />

      <Alerte texte={erreur} className="mb-4" />

      <ListeChargee
        premierChargement={premierChargement}
        chargement={chargement}
        vide={editions.length === 0}
        messageVide={
          <p className="rounded-2xl border border-[var(--sane-border)] bg-white py-12 text-center text-[13px] text-[var(--sane-text-light)]">
          Aucune édition. Créez-en une pour ouvrir les inscriptions.
        </p>
        }
      >
        <ul className="flex flex-col gap-3">
          {editions.map((e) => (
            <li
              key={e.id}
              className={`rounded-2xl border bg-white p-5 ${
                e.active ? "border-[var(--sane-green)]" : "border-[var(--sane-border)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-bold text-[var(--sane-text)]">{e.nom}</h2>
                    {e.active && (
                      <span className="rounded-full bg-[var(--sane-green-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--sane-green)]">
                        Active
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        e.inscriptions_ouvertes
                          ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
                          : "bg-[#fdf1f1] text-[var(--sane-red-dark)]"
                      }`}
                    >
                      {e.inscriptions_ouvertes ? "Inscriptions ouvertes" : "Inscriptions fermées"}
                    </span>
                  </div>

                  <p className="mb-1 inline-flex items-center gap-1.5 text-[13px] text-[var(--sane-text)]">
                    <CalendarDays size={14} className="text-[var(--sane-green)]" />
                    du {formatDate(e.date_debut)} au {formatDate(e.date_fin)}
                  </p>

                  {e.lieu && (
                    <p className="inline-flex items-center gap-1.5 text-[12px] text-[var(--sane-text-light)] sm:ml-4">
                      <MapPin size={13} /> {e.lieu}
                    </p>
                  )}

                  <p className="mt-2 text-[12px] text-[var(--sane-text-light)]">
                    {e.formations_count} formation(s) · {e.inscriptions_count} inscription(s)
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1">
                  <Spinner actif={enCours === e.id} className="text-[var(--sane-green)]" />

                  {/*
                    Icons, with the tooltip saying what each one decides.
                    
                    The tick is hidden on the edition that is already active,
                    which is why the row is one button shorter there.
                  */}
                  <button
                    type="button"
                    onClick={() => action(e, "inscriptions")}
                    disabled={enCours === e.id}
                    title={
                      e.inscriptions_ouvertes
                        ? "Fermer le formulaire d'inscription du site public"
                        : "Rouvrir le formulaire d'inscription du site public"
                    }
                    className="rounded-lg p-2 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"
                  >
                    {e.inscriptions_ouvertes ? <Unlock size={15} /> : <Lock size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => action(e, "activer")}
                    disabled={enCours === e.id}
                    title="Rendre active : les inscriptions et les formations du site public porteront sur cette édition"
                    className={
                      "rounded-lg p-2 text-[var(--sane-green)] hover:bg-[var(--sane-green-light)] " +
                      (e.active ? "hidden" : "block")
                    }
                  >
                    <CheckCircle2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => ouvrir(e)}
                    title="Modifier"
                    className="rounded-lg p-2 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setASupprimer(e)}
                    disabled={enCours === e.id}
                    title="Supprimer"
                    className="rounded-lg p-2 text-[var(--sane-red-dark)] hover:bg-[#fdf1f1]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ListeChargee>
    </>
  );
}

export default function EvenementsAdminPage() {
  return (
    <AdminPage
      section="Événements"
      titre="Éditions du SANEM"
      description="Dates, lieu et ouverture des inscriptions de l'événement"
    >
      <Suspense fallback={null}>
        <Contenu />
      </Suspense>
    </AdminPage>
  );
}
