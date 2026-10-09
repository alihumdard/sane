"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, CheckCircle2, Clock, Loader2, RefreshCw, Users, X, XCircle } from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import StatsCard from "@/components/dashboard/StatsCard";
import { useTable } from "@/components/dashboard/useTable";
import { AdminGuard } from "@/components/dashboard/AdminGuard";
import { adminNav } from "@/lib/adminNav";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { AdminInscriptionsResponse, ApiInscription, StatutInscription } from "@/lib/types";

const sidebarItems = adminNav("Formations", 5);

/** Flattened for the table: useTable searches string/number fields, not nested objects. */
interface LigneInscription {
  id: number;
  reference: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  participation: string;
  formations: string;
  statut: string;
  statutCode: StatutInscription;
  date: string;
  statutColor: string;
  statutBg: string;
}

const COULEURS: Record<StatutInscription, { statutColor: string; statutBg: string }> = {
  en_attente: { statutColor: "var(--sane-amber-dark)", statutBg: "var(--sane-amber-tint)" },
  confirmee: { statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)" },
  annulee: { statutColor: "var(--sane-red-dark)", statutBg: "#fef2f2" },
};

function enLigne(i: ApiInscription): LigneInscription {
  return {
    id: i.id,
    reference: i.reference,
    nom: i.nom,
    email: i.email,
    telephone: i.telephone ? `+227 ${i.telephone}` : "",
    ville: i.ville ?? "",
    participation: i.type_participation_label,
    formations: (i.formations ?? []).map((f) => f.titre).join(", ") || "—",
    statut: i.statut_label,
    statutCode: i.statut,
    date: new Date(i.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    ...COULEURS[i.statut],
  };
}

export default function InscriptionsPage() {
  return (
    <AdminGuard>
      <InscriptionsContent />
    </AdminGuard>
  );
}

function InscriptionsContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lignes, setLignes] = useState<LigneInscription[]>([]);
  const [resume, setResume] = useState({ total: 0, en_attente: 0, confirmee: 0, annulee: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const charger = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetched whole, then filtered in the browser; the edition's volume is small
      // enough that paging the API would cost a round trip per keystroke.
      const res = await api.get<AdminInscriptionsResponse>("/admin/inscriptions?per_page=100");
      setLignes(res.data.map(enLigne));
      setResume(res.resume);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Impossible de charger les inscriptions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function changerStatut(id: number, statut: StatutInscription) {
    setEnCours(id);
    setMessage(null);

    try {
      const res = await api.put<{ message: string; data: ApiInscription }>(
        `/admin/inscriptions/${id}/statut`,
        { statut }
      );
      setMessage(res.message);
      await charger();
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : "L'opération a échoué.");
    } finally {
      setEnCours(null);
    }
  }

  const stats = [
    { icon: <Users size={20} />, value: String(resume.total), label: "Total inscriptions", bg: "var(--sane-green-tint)", color: "var(--sane-green)" },
    { icon: <Clock size={20} />, value: String(resume.en_attente), label: "En attente de validation", bg: "var(--sane-amber-tint)", color: "var(--sane-amber-dark)" },
    { icon: <CheckCircle2 size={20} />, value: String(resume.confirmee), label: "Confirmées", bg: "var(--sane-blue-tint)", color: "var(--sane-blue)" },
    { icon: <XCircle size={20} />, value: String(resume.annulee), label: "Annulées", bg: "var(--sane-purple-tint)", color: "var(--sane-purple)" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          searchPlaceholder="Rechercher un participant…"
          notificationCount={resume.en_attente}
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
            <span className="font-semibold text-[var(--sane-green-deep)]">Inscriptions</span>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--sane-green-deep)] px-5 py-4">
            <div>
              <h1 className="text-[20px] font-extrabold leading-tight text-white">Inscriptions au salon</h1>
              <p className="mt-1 max-w-[520px] text-[11px] leading-relaxed text-white/80">
                Validez ou annulez les inscriptions. Annuler libère automatiquement les places réservées
                sur les formations choisies.
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
              <p className="text-[12px] text-[var(--sane-text-light)]">Chargement des inscriptions…</p>
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
            <Tableau lignes={lignes} enCours={enCours} onChangerStatut={changerStatut} />
          )}
        </main>
      </div>
    </div>
  );
}

function Tableau({
  lignes,
  enCours,
  onChangerStatut,
}: {
  lignes: LigneInscription[];
  enCours: number | null;
  onChangerStatut: (id: number, statut: StatutInscription) => void;
}) {
  const tbl = useTable(lignes, {
    filterKeys: { Statut: "statut", Participation: "participation", Ville: "ville" },
    sortGetters: {
      nom: (r) => r.nom,
      date: (r) => r.date,
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <FilterBar
        searchPlaceholder="Rechercher par nom, email, référence…"
        filters={["Statut", "Participation", "Ville"]}
        table={tbl}
      />

      <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
              {["Référence", "Participant", "Contact", "Participation", "Formations", "Statut", "Date", "Actions"].map((h) => (
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
                <td colSpan={8} className="px-4 py-12 text-center text-[12px] text-[var(--sane-text-light)]">
                  Aucune inscription ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              tbl.pageRows.map((r) => (
                <tr key={r._uid} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                  <td className="whitespace-nowrap px-2 py-2.5 text-[11px] font-semibold text-[var(--sane-green-deep)]">
                    {r.reference}
                  </td>
                  <td className="px-2 py-2.5">
                    <p className="text-[12px] font-semibold text-[var(--sane-green-deep)]">{r.nom}</p>
                    <p className="text-[9px] text-[var(--sane-text-light)]">{r.ville}</p>
                  </td>
                  <td className="px-2 py-2.5">
                    <p className="text-[11px] text-[var(--sane-green-deep)]">{r.email}</p>
                    <p className="text-[9px] text-[var(--sane-text-light)]">{r.telephone}</p>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-green-deep)]">
                    {r.participation}
                  </td>
                  <td className="max-w-[220px] px-2 py-2.5">
                    <p className="truncate text-[11px] text-[var(--sane-text-light)]" title={r.formations}>
                      {r.formations}
                    </p>
                  </td>
                  <td className="px-2 py-2.5">
                    <span
                      className="whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold"
                      style={{ backgroundColor: r.statutBg, color: r.statutColor }}
                    >
                      {r.statut}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-text-light)]">{r.date}</td>
                  <td className="px-2 py-2.5">
                    <ActionsStatut
                      ligne={r}
                      occupe={enCours === r.id}
                      onChangerStatut={onChangerStatut}
                    />
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
          itemLabel="inscriptions"
          onPageChange={tbl.setPage}
          onPageSizeChange={tbl.setPageSize}
        />
      </div>
    </div>
  );
}

function ActionsStatut({
  ligne,
  occupe,
  onChangerStatut,
}: {
  ligne: LigneInscription;
  occupe: boolean;
  onChangerStatut: (id: number, statut: StatutInscription) => void;
}) {
  if (occupe) {
    return (
      <div className="flex justify-center">
        <Loader2 size={14} className="animate-spin text-[var(--sane-green)]" />
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-1.5">
      {ligne.statutCode !== "confirmee" && (
        <button
          type="button"
          onClick={() => onChangerStatut(ligne.id, "confirmee")}
          title="Confirmer"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sane-green-tint)] text-[var(--sane-green)] transition-opacity hover:opacity-70"
        >
          <Check size={14} />
        </button>
      )}
      {ligne.statutCode !== "annulee" && (
        <button
          type="button"
          onClick={() => onChangerStatut(ligne.id, "annulee")}
          title="Annuler (libère les places)"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fef2f2] text-[var(--sane-red-dark)] transition-opacity hover:opacity-70"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
