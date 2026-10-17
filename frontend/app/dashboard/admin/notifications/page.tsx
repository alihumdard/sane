"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send, XCircle } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { AdminTable, type Colonne } from "@/components/dashboard/AdminTable";
import { useApiTable } from "@/components/dashboard/useApiTable";
import { api, ApiError } from "@/lib/api";

interface EnvoiNotification {
  id: number;
  destinataire_email: string;
  destinataire_nom: string | null;
  sujet: string;
  mail_classe: string;
  statut: "envoyee" | "echouee";
  erreur: string | null;
  envoye_le: string | null;
  created_at: string;
}

const STATUTS = [
  { value: "envoyee", label: "Envoyée" },
  { value: "echouee", label: "Échouée" },
];

export default function NotificationsAdminPage() {
  const [filtreStatut, setFiltreStatut] = useState("");
  const table = useApiTable<EnvoiNotification>("/admin/notifications", { filtres: { statut: filtreStatut } });
  const [renvoi, setRenvoi] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function renvoyer(envoi: EnvoiNotification) {
    setRenvoi(envoi.id);
    setMessage(null);

    try {
      const res = await api.post<{ message: string }>(`/admin/notifications/${envoi.id}/renvoyer`);
      setMessage(res.message);
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Renvoi impossible.");
    } finally {
      setRenvoi(null);
    }
  }

  const colonnes: Colonne<EnvoiNotification>[] = [
    {
      cle: "sujet",
      entete: "Message",
      rendu: (e) => (
        <>
          <p className="font-semibold">{e.sujet}</p>
          <p className="text-[11px] text-[var(--sane-text-light)]">{e.mail_classe.replace("App\\Mail\\", "")}</p>
        </>
      ),
    },
    {
      cle: "destinataire",
      entete: "Destinataire",
      rendu: (e) => (
        <>
          <p>{e.destinataire_nom ?? "—"}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{e.destinataire_email}</p>
        </>
      ),
    },
    {
      cle: "envoye_le",
      entete: "Date",
      masquer: "sm",
      rendu: (e) => new Date(e.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    },
    {
      cle: "statut",
      entete: "Statut",
      rendu: (e) =>
        e.statut === "envoyee" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sane-green-tint)] px-2.5 py-1 text-[11px] font-semibold text-[var(--sane-green)]">
            <CheckCircle2 size={12} /> Envoyée
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdf1f1] px-2.5 py-1 text-[11px] font-semibold text-[var(--sane-red-dark)]" title={e.erreur ?? undefined}>
            <XCircle size={12} /> Échouée
          </span>
        ),
    },
    {
      cle: "actions",
      entete: "",
      rendu: (e) => (
        <button
          type="button"
          onClick={() => renvoyer(e)}
          disabled={renvoi === e.id}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-3 py-1.5 text-[12px] font-semibold text-[var(--sane-text)] hover:border-[var(--sane-green)] hover:text-[var(--sane-green)] disabled:opacity-50"
        >
          {renvoi === e.id ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          Renvoyer
        </button>
      ),
    },
  ];

  return (
    <AdminPage section="Notifications" titre="Notifications" description="Historique des emails envoyés par la plateforme">
      {message && (
        <p className="mb-4 flex items-center gap-2 rounded-xl border border-[var(--sane-green)] bg-[var(--sane-green-tint)] p-3 text-[13px] text-[var(--sane-green)]">
          <CheckCircle2 size={15} /> {message}
        </p>
      )}

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
          <p className="text-[22px] font-bold text-[var(--sane-text)]">{table.resume.total ?? 0}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">Total envoyé</p>
        </div>
        <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
          <p className="text-[22px] font-bold text-[var(--sane-green)]">{table.resume.envoyees ?? 0}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">Envoyées</p>
        </div>
        <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
          <p className="text-[22px] font-bold text-[var(--sane-red-dark)]">{table.resume.echouees ?? 0}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">Échouées</p>
        </div>
      </div>

      {table.erreur && (
        <p role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] p-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
          <span className="text-[13px] text-[var(--sane-red-dark)]">{table.erreur}</span>
        </p>
      )}

      <AdminTable
        colonnes={colonnes}
        lignes={table.lignes}
        meta={table.meta}
        chargement={table.chargement}
        erreur={null}
        recherche={table.recherche}
        onRecherche={table.setRecherche}
        onPage={table.setPage}
        cle={(e) => e.id}
        vide="Aucun envoi pour le moment."
        actions={
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            aria-label="Filtrer par statut"
            className="rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
          >
            <option value="">Tous les statuts</option>
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        }
      />
    </AdminPage>
  );
}
