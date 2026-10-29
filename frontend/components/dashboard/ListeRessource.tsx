"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminTable, type Colonne } from "./AdminTable";
import { DialogueConfirmation } from "./DialogueConfirmation";
import { useApiTable } from "./useApiTable";
import { useMessageEnregistrement } from "./messageEnregistrement";
import type { DefinitionRessource } from "./ressource";
import { Alerte } from "@/components/ui/Alerte";
import { api, ApiError } from "@/lib/api";

/**
 * The list half of an editorial resource.
 *
 * Adding and editing used to replace this table with a form in place, under
 * the list's own URL: there was no address for "the news item I am writing",
 * the browser's back button left the form instead of the field, and a reload
 * threw the draft away. Both are now pages of their own, and this screen only
 * lists and deletes.
 */
export function ListeRessource<T>({ def }: { def: DefinitionRessource<T> }) {
  const table = useApiTable<T>(def.endpoint);
  const enregistre = useMessageEnregistrement(def.base);

  const [aSupprimer, setASupprimer] = useState<T | null>(null);
  const [suppression, setSuppression] = useState(false);

  async function supprimer() {
    if (!aSupprimer) return;

    setSuppression(true);

    try {
      await api.delete(def.endpoint + "/" + def.cle(aSupprimer));
      setASupprimer(null);
      await table.recharger();
    } catch (err) {
      table.setErreur(err instanceof ApiError ? err.message : "Suppression impossible.");
      setASupprimer(null);
    } finally {
      setSuppression(false);
    }
  }

  const colonnes: Colonne<T>[] = [
    ...def.colonnes,
    {
      cle: "_actions",
      entete: "Actions",
      fin: true,
      rendu: (ligne) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={def.base + "/" + def.cle(ligne)}
            title="Modifier"
            aria-label={"Modifier : " + def.nomDe(ligne)}
            className="rounded-lg p-2 text-[var(--sane-text-light)] transition-colors hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)]"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            onClick={() => setASupprimer(ligne)}
            title="Supprimer"
            aria-label={"Supprimer : " + def.nomDe(ligne)}
            className="rounded-lg p-2 text-[var(--sane-text-light)] transition-colors hover:bg-[#fdf1f1] hover:text-[var(--sane-red-dark)]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DialogueConfirmation
        ouvert={aSupprimer !== null}
        titre={"Supprimer " + def.libelle + " ?"}
        message={
          aSupprimer
            ? "« " + def.nomDe(aSupprimer) + " » sera retiré du site. Cette action est définitive."
            : ""
        }
        enCours={suppression}
        onConfirmer={supprimer}
        onAnnuler={() => setASupprimer(null)}
      />

      <Alerte texte={enregistre} ton="succes" className="mb-3" />

      <AdminTable
        colonnes={colonnes}
        lignes={table.lignes}
        meta={table.meta}
        chargement={table.chargement}
        erreur={table.erreur}
        recherche={table.recherche}
        onRecherche={table.setRecherche}
        onPage={table.setPage}
        cle={(l) => def.cle(l)}
        vide={def.vide}
        rechercheLabel={def.rechercheLabel}
        actions={
          <Link
            href={def.base + "/nouveau"}
            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--sane-orange)] px-5 text-[13px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(229,118,23,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[var(--sane-orange-dark)] hover:shadow-[0_10px_22px_-6px_rgba(229,118,23,0.85)]"
          >
            <Plus size={15} /> {def.ajouter}
          </Link>
        }
      />
    </>
  );
}
