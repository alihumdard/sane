"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {Pencil, Plus, Trash2, X} from "lucide-react";
import { Spinner } from "./Spinner";
import { ChampImage } from "./ChampImage";
import { AdminTable, type Colonne } from "./AdminTable";
import { useApiTable } from "./useApiTable";
import { api, ApiError } from "@/lib/api";

export interface ChampFormulaire {
  nom: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "date" | "url" | "checkbox" | "image";
  options?: { value: string; label: string }[];
  requis?: boolean;
  pleineLargeur?: boolean;
}

interface ContenuCrudProps<T> {
  endpoint: string;
  /**
   * The collection an uploaded image belongs to — formateurs, partenaires,
   * actualites. Required by any resource declaring an "image" field, since
   * the upload endpoint is addressed by collection and record id.
   */
  typeImage?: string;
  colonnes: Colonne<T>[];
  champs: ChampFormulaire[];
  /** Pre-fills the form when editing; omit a field to leave it blank. */
  versFormulaire: (ligne: T) => Record<string, unknown>;
  cle: (ligne: T) => string | number;
  libelle: string;
  vide?: string;
}

const champClass =
  "w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10";

/**
 * List + create/edit/delete for the editorial resources.
 *
 * News, FAQ, partners and press differ only in their columns and form fields,
 * so they share this rather than carrying four copies of the same screen.
 */
export function ContenuCrud<T>({
  endpoint,
  typeImage,
  colonnes,
  champs,
  versFormulaire,
  cle,
  libelle,
  vide,
}: ContenuCrudProps<T>) {
  const table = useApiTable<T>(endpoint);

  // The sidebar's "Ajouter ..." entries link here with ?nouveau=1, so the link
  // opens the form rather than merely landing on the list.
  const params = useSearchParams();

  const [edition, setEdition] = useState<T | "nouveau" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [envoi, setEnvoi] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (params.get("nouveau")) {
      void Promise.resolve().then(() => ouvrir("nouveau"));
    }
    // ouvrir only resets local form state, so it is stable enough to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function ouvrir(ligne: T | "nouveau") {
    setEdition(ligne);
    setForm(ligne === "nouveau" ? {} : versFormulaire(ligne));
    setErreurs({});
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreurs({});

    try {
      if (edition === "nouveau") await api.post(endpoint, form);
      else if (edition) await api.put(`${endpoint}/${cle(edition)}`, form);

      setEdition(null);
      await table.recharger();
    } catch (err) {
      if (err instanceof ApiError) {
        setErreurs(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])));
        if (Object.keys(err.errors).length === 0) table.setErreur(err.message);
      } else {
        table.setErreur("Enregistrement impossible.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(ligne: T) {
    if (!confirm(`Supprimer cet élément ? Cette action est définitive.`)) return;

    try {
      await api.delete(`${endpoint}/${cle(ligne)}`);
      await table.recharger();
    } catch (err) {
      table.setErreur(err instanceof ApiError ? err.message : "Suppression impossible.");
    }
  }

  const colonnesAvecActions: Colonne<T>[] = [
    ...colonnes,
    {
      cle: "_actions",
      entete: "",
      rendu: (ligne) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => ouvrir(ligne)} title="Modifier" className="rounded-lg p-2 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]">
            <Pencil size={15} />
          </button>
          <button type="button" onClick={() => supprimer(ligne)} title="Supprimer" className="rounded-lg p-2 text-[var(--sane-red-dark)] hover:bg-[#fdf1f1]">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  if (edition !== null) {
    return (
      <form onSubmit={enregistrer} className="max-w-[760px] rounded-2xl border border-[var(--sane-border)] bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[var(--sane-text)]">
            {edition === "nouveau" ? `Ajouter : ${libelle}` : `Modifier : ${libelle}`}
          </h2>
          <button type="button" onClick={() => setEdition(null)} aria-label="Fermer" className="rounded-lg p-2 hover:bg-[var(--sane-background)]">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {champs.map((c) => (
            <div key={c.nom} className={c.pleineLargeur || c.type === "textarea" ? "sm:col-span-2" : ""}>
              <label
                htmlFor={c.nom}
                className={`mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)] ${c.type === "image" ? "hidden" : ""}`}
              >
                {c.label} {c.requis && "*"}
              </label>

              {c.type === "image" ? (
                <ChampImage
                  type={typeImage ?? ""}
                  id={typeof form.id === "number" ? form.id : null}
                  valeur={String(form[c.nom] ?? "")}
                  onChange={(chemin) => setForm((f) => ({ ...f, [c.nom]: chemin }))}
                />
              ) : c.type === "textarea" ? (
                <textarea
                  id={c.nom} rows={5} required={c.requis}
                  value={String(form[c.nom] ?? "")}
                  onChange={(e) => setForm((f) => ({ ...f, [c.nom]: e.target.value }))}
                  className={champClass}
                />
              ) : c.type === "select" ? (
                <select
                  id={c.nom} required={c.requis}
                  value={String(form[c.nom] ?? "")}
                  onChange={(e) => setForm((f) => ({ ...f, [c.nom]: e.target.value }))}
                  className={champClass}
                >
                  <option value="">—</option>
                  {c.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : c.type === "checkbox" ? (
                <label className="flex items-center gap-2 py-2 text-[13px]">
                  <input
                    id={c.nom} type="checkbox"
                    checked={Boolean(form[c.nom])}
                    onChange={(e) => setForm((f) => ({ ...f, [c.nom]: e.target.checked }))}
                    className="h-4 w-4 accent-[var(--sane-green)]"
                  />
                  {c.label}
                </label>
              ) : (
                <input
                  id={c.nom} type={c.type ?? "text"} required={c.requis}
                  value={String(form[c.nom] ?? "")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      [c.nom]: c.type === "number" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  className={champClass}
                />
              )}

              {erreurs[c.nom] && (
                <p className="mt-1 text-[12px] text-[var(--sane-red-dark)]">{erreurs[c.nom]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit" disabled={envoi}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--sane-orange)] px-5 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
        >
          <Spinner actif={envoi} />
          Enregistrer
        </button>
      </form>
    );
  }

  return (
    <AdminTable
      colonnes={colonnesAvecActions}
      lignes={table.lignes}
      meta={table.meta}
      chargement={table.chargement}
      erreur={table.erreur}
      recherche={table.recherche}
      onRecherche={table.setRecherche}
      onPage={table.setPage}
      cle={cle}
      vide={vide}
      actions={
        <button
          type="button"
          onClick={() => ouvrir("nouveau")}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[13px] font-bold text-white"
        >
          <Plus size={15} /> Ajouter
        </button>
      }
    />
  );
}
