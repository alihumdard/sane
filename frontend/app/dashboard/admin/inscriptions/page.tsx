"use client";

import { useState } from "react";
import { Check, CheckCircle2, Clock, FileDown, Users, X, XCircle } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { AdminTable, type Colonne } from "@/components/dashboard/AdminTable";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { Spinner, SpinnerOu } from "@/components/dashboard/Spinner";
import { useApiTable } from "@/components/dashboard/useApiTable";
import { Alerte } from "@/components/ui/Alerte";
import { api, ApiError } from "@/lib/api";
import type { ApiInscription, DocumentUpload, StatutInscription } from "@/lib/types";

const STATUTS: { value: StatutInscription | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmées" },
  { value: "annulee", label: "Annulées" },
];

const TONS: Record<StatutInscription, string> = {
  en_attente: "bg-[var(--sane-amber-tint)] text-[var(--sane-amber-dark)]",
  confirmee: "bg-[var(--sane-green-tint)] text-[var(--sane-green)]",
  annulee: "bg-[#fef2f2] text-[var(--sane-red-dark)]",
};

const ABREVIATIONS: Record<string, string> = {
  piece_identite: "CNI",
  cv: "CV",
  lettre_motivation: "LM",
  photo: "Photo",
};

/**
 * Three required slots plus an optional cover letter. Downloads go through
 * fetch rather than a plain link, because the endpoint needs the bearer token
 * and the files are deliberately not publicly reachable.
 */
function Documents({ documents }: { documents: DocumentUpload[] }) {
  const [enCours, setEnCours] = useState<number | null>(null);

  async function telecharger(doc: DocumentUpload) {
    setEnCours(doc.id);

    try {
      const blob = await api.download(doc.url);
      const url = URL.createObjectURL(blob);
      const lien = document.createElement("a");

      lien.href = url;
      lien.download = doc.nom_original;
      lien.click();
      URL.revokeObjectURL(url);
    } finally {
      setEnCours(null);
    }
  }

  return (
    <div className="flex flex-wrap justify-end gap-1 sm:justify-start">
      <span
        className={"whitespace-nowrap text-[11px] text-[var(--sane-text-light)] " + (documents.length === 0 ? "inline" : "hidden")}
      >
        Aucun
      </span>

      {documents.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => telecharger(d)}
          disabled={enCours === d.id}
          title={d.type_label + " — " + d.nom_original}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--sane-green-tint)] px-1.5 py-1 text-[10px] font-bold text-[var(--sane-green)] transition-opacity hover:opacity-70 disabled:opacity-50"
        >
          <SpinnerOu actif={enCours === d.id} size={10}>
            <FileDown size={10} />
          </SpinnerOu>
          {ABREVIATIONS[d.type] ?? d.type_label}
        </button>
      ))}
    </div>
  );
}

/**
 * Registrations for the current edition.
 *
 * Search, filters and paging used to run in the browser over the first
 * hundred rows the API happened to return, which quietly stopped finding
 * anyone past that point. They now resolve on the server, like the rest of
 * the back-office lists.
 */
function Contenu() {
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreParticipation, setFiltreParticipation] = useState("");

  const table = useApiTable<ApiInscription>("/admin/inscriptions", {
    filtres: { statut: filtreStatut, type_participation: filtreParticipation },
  });

  const [enCours, setEnCours] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  /*
   * The API answers this filter with {value, label} pairs, as it does for the
   * statuses. Reading them as plain strings put objects in the <option>, and
   * React takes the whole page down with "Objects are not valid as a React
   * child" the moment the list arrives.
   */
  const participations = Array.isArray(table.filtresApi.type_participation)
    ? (table.filtresApi.type_participation as { value: string; label: string }[])
    : [];

  async function changerStatut(i: ApiInscription, statut: StatutInscription) {
    setEnCours(i.id);
    setMessage(null);

    try {
      const res = await api.put<{ message: string }>("/admin/inscriptions/" + i.id + "/statut", { statut });

      setMessage(res.message);
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "L'opération a échoué.");
    } finally {
      setEnCours(null);
    }
  }

  const colonnes: Colonne<ApiInscription>[] = [
    {
      cle: "reference",
      entete: "Référence",
      rendu: (i) => <span className="whitespace-nowrap font-semibold">{i.reference}</span>,
    },
    {
      cle: "participant",
      entete: "Participant",
      rendu: (i) => (
        <div className="min-w-0">
          <p className="font-semibold">{i.nom}</p>
          <p className="truncate text-[12px] text-[var(--sane-text-light)]">{i.email}</p>
        </div>
      ),
    },
    {
      cle: "contact",
      entete: "Contact",
      masquer: "lg",
      rendu: (i) => (
        <>
          <p>{i.telephone ? "+227 " + i.telephone : "—"}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{i.ville ?? ""}</p>
        </>
      ),
    },
    {
      cle: "participation",
      entete: "Participation",
      masquer: "md",
      rendu: (i) => (
        <>
          <p className="whitespace-nowrap">{i.type_participation_label}</p>
          <p className="max-w-[220px] truncate text-[12px] text-[var(--sane-text-light)]">
            {(i.formations ?? []).map((f) => f.titre).join(", ") || "Aucune formation"}
          </p>
        </>
      ),
    },
    {
      cle: "documents",
      entete: "Documents",
      masquer: "lg",
      rendu: (i) => <Documents documents={i.documents ?? []} />,
    },
    {
      cle: "statut",
      entete: "Statut",
      masquer: "sm",
      rendu: (i) => (
        <span
          className={
            "inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold " + TONS[i.statut]
          }
        >
          {i.statut_label}
        </span>
      ),
    },
    {
      cle: "date",
      entete: "Reçue le",
      masquer: "lg",
      rendu: (i) =>
        new Date(i.created_at).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      cle: "_actions",
      entete: "Actions",
      fin: true,
      rendu: (i) => (
        <div className="flex items-center justify-end gap-1.5">
          <Spinner actif={enCours === i.id} size={14} className="text-[var(--sane-green)]" />
          <button
            type="button"
            onClick={() => changerStatut(i, "confirmee")}
            disabled={enCours === i.id}
            title="Confirmer cette inscription"
            aria-label={"Confirmer l'inscription de " + i.nom}
            className={
              "h-8 w-8 items-center justify-center rounded-lg bg-[var(--sane-green-tint)] text-[var(--sane-green)] transition-opacity hover:opacity-70 disabled:opacity-40 " +
              (i.statut === "confirmee" ? "hidden" : "inline-flex")
            }
          >
            <Check size={15} />
          </button>
          <button
            type="button"
            onClick={() => changerStatut(i, "annulee")}
            disabled={enCours === i.id}
            title="Annuler — libère les places réservées"
            aria-label={"Annuler l'inscription de " + i.nom}
            className={
              "h-8 w-8 items-center justify-center rounded-lg bg-[#fef2f2] text-[var(--sane-red-dark)] transition-opacity hover:opacity-70 disabled:opacity-40 " +
              (i.statut === "annulee" ? "hidden" : "inline-flex")
            }
          >
            <X size={15} />
          </button>
        </div>
      ),
    },
  ];

  const selectClass =
    "h-11 rounded-xl border border-[var(--sane-border)] bg-white px-3.5 text-[12.5px] font-medium text-[var(--sane-text)] outline-none transition-all hover:border-[var(--sane-green-muted)] focus:border-[var(--sane-green-muted)] focus:ring-4 focus:ring-[var(--sane-green)]/8";

  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardStatCard icon={<Users size={20} />} value={table.resume.total ?? 0} label="Inscriptions au total" accent="green" />
        <DashboardStatCard
          icon={<Clock size={20} />}
          value={table.resume.en_attente ?? 0}
          label="En attente de validation"
          accent="orange"
        />
        <DashboardStatCard icon={<CheckCircle2 size={20} />} value={table.resume.confirmee ?? 0} label="Confirmées" accent="blue" />
        <DashboardStatCard icon={<XCircle size={20} />} value={table.resume.annulee ?? 0} label="Annulées" accent="teal" />
      </div>

      <Alerte texte={message} ton="succes" className="mb-3" />

      <AdminTable
        colonnes={colonnes}
        lignes={table.lignes}
        meta={table.meta}
        chargement={table.chargement}
        erreur={table.erreur}
        recherche={table.recherche}
        onRecherche={table.setRecherche}
        onPage={table.setPage}
        cle={(i) => i.id}
        vide="Aucune inscription pour cette édition."
        rechercheLabel="Rechercher un nom, un email, une référence…"
        filtres={
          <>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              aria-label="Filtrer par statut"
              className={selectClass}
            >
              {STATUTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              value={filtreParticipation}
              onChange={(e) => setFiltreParticipation(e.target.value)}
              aria-label="Filtrer par type de participation"
              className={selectClass + " " + (participations.length > 0 ? "block" : "hidden")}
            >
              <option value="">Toutes les participations</option>
              {participations.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </>
        }
      />
    </>
  );
}

export default function InscriptionsAdminPage() {
  return (
    <AdminPage
      section="Formations"
      titre="Inscriptions au salon"
      description="Validez ou annulez les inscriptions. Annuler libère automatiquement les places réservées sur les formations choisies."
    >
      <Contenu />
    </AdminPage>
  );
}
