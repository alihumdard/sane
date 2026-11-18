"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Users } from "lucide-react";
import { Spinner, SpinnerOu } from "@/components/dashboard/Spinner";
import { Alerte } from "@/components/ui/Alerte";
import { api, ApiError, telecharger } from "@/lib/api";
import type { ApiInscription } from "@/lib/types";

const TONS: Record<ApiInscription["statut"], string> = {
  en_attente: "bg-[var(--sane-amber-tint)] text-[var(--sane-amber-dark)]",
  confirmee: "bg-[var(--sane-green-tint)] text-[var(--sane-green)]",
  annulee: "bg-[#fef2f2] text-[var(--sane-red-dark)]",
};

interface Reponse {
  data: ApiInscription[];
  meta: { formation: { id: number; titre: string }; total: number; places_restantes: number };
}

/**
 * Who is registered for one course, and the same list as a spreadsheet.
 *
 * The API served both from the start — the list and its export — but no
 * screen called them: a course could show as full with no way to see who had
 * taken the seats, and the only export was every registration on the platform.
 *
 * Nothing here mounts or unmounts on a state change; loading, empty and error
 * states are toggled with `hidden`, so Google Translate keeps its grip on the
 * page.
 */
export function InscritsFormation({ formationId, slug }: { formationId: number; slug?: string }) {
  const [lignes, setLignes] = useState<ApiInscription[]>([]);
  const [meta, setMeta] = useState<Reponse["meta"] | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [export_, setExport] = useState(false);

  const charger = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);
      const r = await api.get<Reponse>(`/admin/formations/${formationId}/inscrits`);
      setLignes(r.data);
      setMeta(r.meta);
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Impossible de charger la liste des inscrits.");
    } finally {
      setChargement(false);
    }
  }, [formationId]);

  useEffect(() => {
    void Promise.resolve().then(charger);
  }, [charger]);

  async function exporter() {
    setExport(true);
    setErreur(null);

    try {
      await telecharger(
        `/admin/exports/formations/${formationId}/inscrits`,
        `inscrits-${slug || "formation-" + formationId}.xlsx`
      );
    } catch {
      setErreur("Export impossible. Vérifiez votre connexion et réessayez.");
    } finally {
      setExport(false);
    }
  }

  const total = meta?.total ?? lignes.length;
  const vide = !chargement && !erreur && lignes.length === 0;

  return (
    <section
      id="inscrits"
      className="mb-6 scroll-mt-24 rounded-2xl border border-[var(--sane-border)] bg-white p-5 shadow-[0_1px_2px_rgba(16,35,26,0.04),0_8px_24px_-16px_rgba(16,99,45,0.18)] sm:p-7"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sane-green-light)] text-[var(--sane-green)]">
            <Users size={18} />
          </span>
          <div>
            <h2 className="text-[15px] font-bold text-[var(--sane-text)]">Inscrits à cette formation</h2>
            <p className="text-[12px] text-[var(--sane-text-light)]">
              <span className={chargement ? "hidden" : "inline"}>
                {total} inscrit{total > 1 ? "s" : ""}
                <span className={meta ? "inline" : "hidden"}>
                  {" "}· {meta?.places_restantes ?? 0} place{(meta?.places_restantes ?? 0) > 1 ? "s" : ""} restante
                  {(meta?.places_restantes ?? 0) > 1 ? "s" : ""}
                </span>
              </span>
              <span className={chargement ? "inline" : "hidden"}>Chargement…</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={exporter}
          disabled={export_ || chargement || lignes.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--sane-border)] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green-muted)] hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)] disabled:opacity-50"
        >
          <SpinnerOu actif={export_}>
            <Download size={15} />
          </SpinnerOu>
          Exporter la liste (Excel)
        </button>
      </div>

      <Alerte texte={erreur} className="mb-3" />

      <p className={"items-center gap-2 py-6 " + (chargement ? "flex" : "hidden")}>
        <Spinner actif className="text-[var(--sane-green)]" size={16} />
        <span className="text-[13px] text-[var(--sane-text-light)]">Chargement des inscrits…</span>
      </p>

      <p
        className={
          "rounded-xl bg-[var(--sane-background)] px-4 py-6 text-center text-[13px] text-[var(--sane-text-light)] " +
          (vide ? "block" : "hidden")
        }
      >
        Personne n&apos;est encore inscrit à cette formation.
      </p>

      <div className={"overflow-x-auto " + (!chargement && lignes.length > 0 ? "block" : "hidden")}>
        <table className="w-full min-w-[640px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-[var(--sane-border)] text-[11px] uppercase tracking-wide text-[var(--sane-text-light)]">
              <th className="py-2.5 pr-3 font-semibold">#</th>
              <th className="py-2.5 pr-3 font-semibold">Nom</th>
              <th className="py-2.5 pr-3 font-semibold">Référence</th>
              <th className="py-2.5 pr-3 font-semibold">Email</th>
              <th className="py-2.5 pr-3 font-semibold">Téléphone</th>
              <th className="py-2.5 pr-3 font-semibold">Ville</th>
              <th className="py-2.5 pr-3 font-semibold">Statut</th>
              <th className="py-2.5 font-semibold">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((i, n) => (
              <tr key={i.id} className="border-b border-[var(--sane-border)]/60 last:border-0">
                <td className="py-2.5 pr-3 text-[var(--sane-text-light)]">{n + 1}</td>
                <td className="py-2.5 pr-3 font-semibold text-[var(--sane-text)]">{i.nom}</td>
                <td className="whitespace-nowrap py-2.5 pr-3" translate="no">{i.reference}</td>
                <td className="py-2.5 pr-3" translate="no">{i.email}</td>
                <td className="whitespace-nowrap py-2.5 pr-3" translate="no">{i.telephone || "—"}</td>
                <td className="py-2.5 pr-3">{i.ville || "—"}</td>
                <td className="py-2.5 pr-3">
                  <span className={"inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold " + TONS[i.statut]}>
                    {i.statut_label}
                  </span>
                </td>
                <td className="whitespace-nowrap py-2.5">
                  {new Date(i.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
