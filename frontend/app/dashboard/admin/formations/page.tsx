"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, BookOpen, CheckCircle2, EyeOff, Loader2, RefreshCw, Users, X } from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import StatsCard from "@/components/dashboard/StatsCard";
import RowActions from "@/components/dashboard/RowActions";
import TableDialogs from "@/components/dashboard/TableDialogs";
import { useTable } from "@/components/dashboard/useTable";
import { AdminGuard } from "@/components/dashboard/AdminGuard";
import { adminNav } from "@/lib/adminNav";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { AdminFormationsResponse, ApiFormation, FormationPayload } from "@/lib/types";

const sidebarItems = adminNav("Formations", 0);

/**
 * Flattened for the table. TableDialogs reflects over these keys to build the
 * add/edit form, so every scalar here becomes an input — only fields an admin
 * should actually edit belong. `id`, `inscPct` and the `img`-matching keys are
 * hidden by STYLE_KEY; the live booked count is looked up from the API data by
 * id rather than carried on the row, since it is owned by the server and must
 * not become an editable field.
 */
interface LigneFormation {
  id: number;
  titre: string;
  categorie: string;
  duree: string;
  lieu: string;
  niveau: string;
  format: string;
  maxInscriptions: number;
  statut: string;
  inscPct: number;
  statutColor: string;
  statutBg: string;
}

const STATUTS = {
  Brouillon: { statutColor: "var(--sane-text-light)", statutBg: "var(--sane-background)" },
  Complète: { statutColor: "var(--sane-purple)", statutBg: "var(--sane-purple-tint)" },
  Publiée: { statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)" },
} as const;

function enLigne(f: ApiFormation): LigneFormation {
  const statut: keyof typeof STATUTS = !f.publiee ? "Brouillon" : f.complete ? "Complète" : "Publiée";

  return {
    id: f.id,
    titre: f.titre,
    categorie: f.categorie?.nom ?? "—",
    duree: f.duree,
    lieu: f.lieu,
    niveau: f.niveau,
    format: f.format,
    maxInscriptions: f.max_inscriptions,
    inscPct: f.taux_remplissage,
    statut,
    ...STATUTS[statut],
  };
}

export default function FormationsPage() {
  return (
    <AdminGuard>
      <FormationsContent />
    </AdminGuard>
  );
}

function FormationsContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formations, setFormations] = useState<ApiFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const charger = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<AdminFormationsResponse>("/admin/formations?per_page=100");
      setFormations(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Impossible de charger les formations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  const total = formations.length;
  const publiees = formations.filter((f) => f.publiee).length;
  const inscrits = formations.reduce((n, f) => n + f.inscriptions_count, 0);
  const completes = formations.filter((f) => f.complete).length;

  const stats = [
    { icon: <BookOpen size={20} />, value: String(total), label: "Total des formations", bg: "var(--sane-green-tint)", color: "var(--sane-green)" },
    { icon: <CheckCircle2 size={20} />, value: String(publiees), label: "Publiées", bg: "var(--sane-blue-tint)", color: "var(--sane-blue)" },
    { icon: <Users size={20} />, value: String(inscrits), label: "Inscriptions totales", bg: "var(--sane-orange-tint)", color: "var(--sane-orange)" },
    { icon: <EyeOff size={20} />, value: String(completes), label: "Formations complètes", bg: "var(--sane-purple-tint)", color: "var(--sane-purple)" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          searchPlaceholder="Rechercher une formation…"
          notificationCount={0}
          userName={user?.nom ?? "Admin"}
          userRole={user?.role_label ?? "Administrateur"}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[var(--sane-text-light)]">
            <span>Accueil</span>
            <span className="text-[var(--sane-border)]">›</span>
            <span>Formations</span>
            <span className="text-[var(--sane-border)]">›</span>
            <span className="font-semibold text-[var(--sane-green-deep)]">Toutes les formations</span>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--sane-green-deep)] px-5 py-4">
            <div>
              <h1 className="text-[20px] font-extrabold leading-tight text-white">Gestion des formations</h1>
              <p className="mt-1 max-w-[520px] text-[11px] leading-relaxed text-white/80">
                Créez et organisez le catalogue. Les places restantes se mettent à jour à chaque
                inscription validée.
              </p>
            </div>
            <button
              type="button"
              onClick={charger}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white disabled:opacity-60"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((s) => (
              <StatsCard key={s.label} icon={s.icon} value={s.value} label={s.label} bg={s.bg} color={s.color} />
            ))}
          </div>

          {message && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-[var(--sane-border)] bg-white px-4 py-2.5">
              <p className="text-[12px] text-[var(--sane-green-deep)]">{message}</p>
              <button type="button" onClick={() => setMessage(null)} aria-label="Fermer">
                <X size={14} className="text-[var(--sane-text-light)]" />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--sane-border)] bg-white py-16">
              <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
              <p className="text-[12px] text-[var(--sane-text-light)]">Chargement des formations…</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-dashed border-[var(--sane-red-dark)] bg-white px-6 py-12 text-center">
              <AlertCircle size={22} className="mx-auto mb-2 text-[var(--sane-red-dark)]" />
              <p className="text-[13px] font-semibold text-[var(--sane-green-deep)]">{error}</p>
              <button type="button" onClick={charger} className="mt-3 text-[12px] font-semibold text-[var(--sane-orange)]">
                Réessayer
              </button>
            </div>
          ) : (
            <Tableau
              formations={formations}
              onRecharger={charger}
              onMessage={setMessage}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Tableau({
  formations,
  onRecharger,
  onMessage,
}: {
  formations: ApiFormation[];
  onRecharger: () => Promise<void>;
  onMessage: (m: string) => void;
}) {
  const lignes = formations.map(enLigne);
  const editionId = formations[0]?.edition?.id ?? 0;
  const inscritsParId = new Map(formations.map((f) => [f.id, f.inscriptions_count]));

  const tbl = useTable(lignes, {
    filterKeys: { Catégorie: "categorie", Statut: "statut", Niveau: "niveau", Format: "format" },
    sortGetters: {
      titre: (r) => r.titre,
      inscriptions: (r) => inscritsParId.get(r.id) ?? 0,
    },
  });

  /** TableDialogs edits the flattened row; translate it back into an API payload. */
  function versPayload(row: Record<string, unknown>): FormationPayload {
    return {
      edition_id: editionId,
      titre: String(row.titre ?? ""),
      duree: String(row.duree ?? ""),
      lieu: String(row.lieu ?? "Niamey"),
      niveau: String(row.niveau ?? ""),
      format: String(row.format ?? ""),
      max_inscriptions: Number(row.maxInscriptions) || 0,
      publiee: row.statut !== "Brouillon",
    };
  }

  async function enregistrer(data: Record<string, unknown>) {
    const estEdition = tbl.modal?.mode === "edit";
    const id = tbl.modal?.row?.id;

    try {
      const res = estEdition
        ? await api.put<{ message: string }>(`/admin/formations/${id}`, versPayload({ ...tbl.modal!.row, ...data }))
        : await api.post<{ message: string }>("/admin/formations", versPayload(data));

      tbl.closeModal();
      onMessage(res.message);
      await onRecharger();
    } catch (e) {
      // Keep the dialog open so the admin can correct the field the server rejected.
      onMessage(e instanceof ApiError ? e.message : "L'enregistrement a échoué.");
    }
  }

  async function supprimer(ids: number[]) {
    const erreurs: string[] = [];

    for (const id of ids) {
      try {
        await api.delete(`/admin/formations/${id}`);
      } catch (e) {
        erreurs.push(e instanceof ApiError ? e.message : `Suppression impossible (#${id}).`);
      }
    }

    onMessage(erreurs.length ? erreurs.join(" ") : `${ids.length} formation(s) supprimée(s).`);
    await onRecharger();
  }

  return (
    <div className="flex flex-col gap-3">
      <FilterBar
        searchPlaceholder="Rechercher une formation…"
        filters={["Catégorie", "Statut", "Niveau", "Format"]}
        table={tbl}
      />

      <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
              <th className="px-3 py-2.5 text-left">
                <input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} />
              </th>
              {["Titre", "Catégorie", "Durée", "Niveau", "Format", "Inscriptions", "Statut", "Actions"].map((h) => (
                <th
                  key={h}
                  className={`px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--sane-text-light)] ${
                    h === "Actions" ? "text-center" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tbl.pageRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[12px] text-[var(--sane-text-light)]">
                  Aucune formation ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              tbl.pageRows.map((f) => (
                <tr key={f._uid} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded"
                      checked={tbl.selected.includes(f._uid)}
                      onChange={() => tbl.toggle(f._uid)}
                    />
                  </td>
                  <td className="max-w-[240px] px-2 py-2.5">
                    <p className="text-[12px] font-semibold leading-snug text-[var(--sane-green-deep)]">{f.titre}</p>
                    <p className="text-[9px] text-[var(--sane-text-light)]">{f.lieu}</p>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-green-deep)]">{f.categorie}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-text-light)]">{f.duree}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-text-light)]">{f.niveau}</td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-text-light)]">{f.format}</td>
                  <td className="px-2 py-2.5">
                    <p className="whitespace-nowrap text-[11px] font-semibold text-[var(--sane-green-deep)]">
                      {inscritsParId.get(f.id) ?? 0} / {f.maxInscriptions}
                    </p>
                    <div className="mt-0.5 h-1.5 w-16 overflow-hidden rounded-full bg-[var(--sane-border)]">
                      <div className="h-full rounded-full bg-[var(--sane-green)]" style={{ width: `${f.inscPct}%` }} />
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <span
                      className="whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold"
                      style={{ backgroundColor: f.statutBg, color: f.statutColor }}
                    >
                      {f.statut}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <RowActions table={tbl} row={f} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          current={tbl.page}
          totalPages={tbl.totalPages}
          totalItems={tbl.total}
          pageSize={tbl.pageSize}
          itemLabel="formations"
          onPageChange={tbl.setPage}
          onPageSizeChange={tbl.setPageSize}
        />
      </div>

      <TableDialogs
        table={{
          ...tbl,
          save: enregistrer,
          doDelete: () => {
            const ids = (tbl.confirm ?? [])
              .map((uid) => tbl.rows.find((r) => r._uid === uid)?.id)
              .filter((id): id is number => typeof id === "number");
            tbl.cancelDelete();
            void supprimer(ids);
          },
        }}
        entity="formation"
      />
    </div>
  );
}
