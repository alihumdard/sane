"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { STYLE_KEY, type TableApi } from "./useTable";

type Rec = Record<string, unknown>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: TableApi<any>;
  /** singular noun used in titles, e.g. "actualité" */
  entity: string;
}

const LABELS: Record<string, string> = {
  categorie: "Catégorie", cat: "Catégorie", titre: "Titre", auteur: "Auteur", vues: "Vues", lieu: "Lieu",
  entreprise: "Entreprise", fonction: "Fonction", inscriptions: "Inscriptions", maxInscriptions: "Inscriptions max.",
  evenement: "Événement", telephone: "Téléphone", tel: "Téléphone", org: "Organisation", nom: "Nom",
  role: "Rôle", typeMedia: "Type de média", formateur: "Formateur", sessions: "Sessions", pays: "Pays",
  ville: "Ville", poste: "Poste", candidatures: "Candidatures", contrat: "Contrat",
};

function label(key: string) {
  if (LABELS[key]) return LABELS[key];
  const spaced = key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function Modal({ table, entity }: Props) {
  const modal = table.modal!;
  const mode = modal.mode;
  const sample = (modal.row ?? table.rows[0] ?? {}) as Rec;
  const readOnly = mode === "view";

  const keys = Object.keys(sample).filter(
    (k) => !STYLE_KEY.test(k) && ["string", "number", "boolean"].includes(typeof sample[k])
  );

  const [data, setData] = useState<Rec>(() => {
    if (modal.row) return { ...(modal.row as Rec) };
    const blank: Rec = {};
    for (const k of keys) {
      const v = sample[k];
      blank[k] = typeof v === "number" ? 0 : typeof v === "boolean" ? false : "";
    }
    return blank;
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && table.closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keys with a few repeated values get suggestions (category, status ...)
  const suggestions = (k: string): string[] => {
    if (typeof sample[k] !== "string") return [];
    const vals = table.rows.map((r) => String((r as Rec)[k] ?? ""));
    const uniq = Array.from(new Set(vals)).filter(Boolean);
    return uniq.length > 1 && uniq.length <= 12 && uniq.length < vals.length ? uniq : [];
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const firstText = keys.find((k) => typeof sample[k] === "string");
    if (firstText && !String(data[firstText] ?? "").trim()) {
      setError(`Le champ « ${label(firstText)} » est obligatoire.`);
      return;
    }
    table.save(data);
  };

  const title = mode === "add" ? `Ajouter : ${entity}` : mode === "edit" ? `Modifier : ${entity}` : `Détails : ${entity}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={table.closeModal}>
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--sane-border)] px-5 py-4">
          <h3 className="text-[15px] font-bold text-[var(--sane-green-deep)]">{title}</h3>
          <button type="button" onClick={table.closeModal} className="rounded-full p-1 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-y-auto px-5 py-4 sm:grid-cols-2">
          {keys.map((k) => {
            const v = data[k];
            const long = typeof v === "string" && (v.includes("\n") || v.length > 60);
            const common = "w-full rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10 disabled:bg-[var(--sane-background)]";
            const opts = suggestions(k);
            return (
              <label key={k} className={`flex flex-col gap-1.5 ${long ? "sm:col-span-2" : ""} ${typeof v === "boolean" ? "flex-row items-center" : ""}`}>
                <span className="text-[12px] font-semibold text-[var(--sane-green-deep)]">{label(k)}</span>
                {typeof v === "boolean" ? (
                  <input
                    type="checkbox"
                    disabled={readOnly}
                    checked={v}
                    onChange={(e) => setData({ ...data, [k]: e.target.checked })}
                    className="h-4 w-4 accent-[var(--sane-green)]"
                  />
                ) : long ? (
                  <textarea
                    rows={3}
                    disabled={readOnly}
                    value={String(v ?? "")}
                    onChange={(e) => setData({ ...data, [k]: e.target.value })}
                    className={common}
                  />
                ) : (
                  <>
                    <input
                      type={typeof v === "number" ? "number" : "text"}
                      disabled={readOnly}
                      list={opts.length ? `opts-${k}` : undefined}
                      value={v === undefined || v === null ? "" : String(v)}
                      onChange={(e) =>
                        setData({ ...data, [k]: typeof v === "number" ? Number(e.target.value) : e.target.value })
                      }
                      className={common}
                    />
                    {opts.length > 0 && (
                      <datalist id={`opts-${k}`}>
                        {opts.map((o) => <option key={o} value={o} />)}
                      </datalist>
                    )}
                  </>
                )}
              </label>
            );
          })}
        </div>

        {error && <p className="px-5 pb-1 text-[12px] font-medium text-[#DC2626]">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-[var(--sane-border)] px-5 py-3">
          <button type="button" onClick={table.closeModal} className="rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[12px] font-semibold text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]">
            {readOnly ? "Fermer" : "Annuler"}
          </button>
          {readOnly ? (
            <button
              type="button"
              onClick={() => modal.row && table.openEdit(modal.row)}
              className="rounded-lg bg-[var(--sane-green)] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[var(--sane-green-dark)]"
            >
              Modifier
            </button>
          ) : (
            <button type="submit" className="rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[var(--sane-orange-dark)]">
              Enregistrer
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function TableDialogs({ table, entity }: Props) {
  return (
    <>
      {table.modal && <Modal key={`${table.modal.mode}-${table.modal.row?._uid ?? "new"}`} table={table} entity={entity} />}

      {table.confirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onMouseDown={table.cancelDelete}>
          <div onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-[15px] font-bold text-[var(--sane-green-deep)]">Confirmer la suppression</h3>
            <p className="mt-2 text-[13px] text-[var(--sane-text-light)]">
              {table.confirm.length > 1
                ? `Supprimer ${table.confirm.length} éléments sélectionnés ? Cette action est irréversible.`
                : "Supprimer cet élément ? Cette action est irréversible."}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={table.cancelDelete} className="rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[12px] font-semibold text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]">
                Annuler
              </button>
              <button onClick={table.doDelete} className="rounded-lg bg-[#DC2626] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#b91c1c]">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {table.toast && (
        <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-[var(--sane-green-deep)] px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg">
          {table.toast}
        </div>
      )}
    </>
  );
}
