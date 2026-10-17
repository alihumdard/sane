"use client";

import { useState } from "react";
import { BadgeCheck, Loader2, ShieldOff, Trash2 } from "lucide-react";
import { Spinner } from "@/components/dashboard/Spinner";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { AdminTable, type Colonne } from "@/components/dashboard/AdminTable";
import { useApiTable } from "@/components/dashboard/useApiTable";
import { api, ApiError } from "@/lib/api";
import type { ApiEntretien, ApiOffre } from "@/lib/types";

const STATUTS_ENTRETIEN = [
  { value: "en_attente", label: "En attente" },
  { value: "confirme", label: "Confirmé" },
  { value: "termine", label: "Terminé" },
  { value: "annule", label: "Annulé" },
];

interface AdminEntreprise {
  id: number;
  nom: string;
  secteur: string | null;
  ville: string | null;
  verifiee: boolean;
  offres_count: number;
}

const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "publiee", label: "Publiée" },
  { value: "pourvue", label: "Pourvue" },
  { value: "fermee", label: "Fermée" },
];

function Offres() {
  const [filtreStatut, setFiltreStatut] = useState("");
  const table = useApiTable<ApiOffre>("/admin/emploi/offres", { filtres: { statut: filtreStatut } });
  const [action, setAction] = useState<number | null>(null);

  async function changerStatut(offre: ApiOffre, statut: string) {
    setAction(offre.id);

    try {
      await api.put(`/admin/emploi/offres/${offre.id}/statut`, { statut });
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Modification impossible.");
    } finally {
      setAction(null);
    }
  }

  async function supprimer(offre: ApiOffre) {
    if (!confirm(`Supprimer l'offre « ${offre.titre} » ?`)) return;

    try {
      await api.delete(`/admin/emploi/offres/${offre.id}`);
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Suppression impossible.");
    }
  }

  const colonnes: Colonne<ApiOffre>[] = [
    {
      cle: "titre",
      entete: "Offre",
      rendu: (o) => (
        <>
          <p className="font-semibold">{o.titre}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{o.entreprise?.nom}</p>
        </>
      ),
    },
    { cle: "ville", entete: "Lieu", masquer: "sm", rendu: (o) => `${o.ville} · ${o.type_contrat_label ?? ""}` },
    {
      cle: "statut",
      entete: "Statut",
      masquer: "md",
      rendu: (o) => (
        <select
          value={o.statut ?? ""}
          disabled={action === o.id}
          onChange={(e) => changerStatut(o, e.target.value)}
          aria-label={`Statut de ${o.titre}`}
          className="rounded-lg border border-[var(--sane-border)] px-2 py-1 text-[12px] outline-none focus:border-[var(--sane-green)]"
        >
          {STATUTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      ),
    },
    { cle: "candidatures", entete: "Cand.", masquer: "lg", rendu: (o) => o.candidatures_count },
    {
      cle: "actions",
      entete: "",
      rendu: (o) => (
        <div className="flex items-center justify-end gap-1">
          <Spinner actif={action === o.id} size={14} className="text-[var(--sane-green)]" />
          <button type="button" onClick={() => supprimer(o)} title="Supprimer" className="rounded-lg p-2 text-[var(--sane-red-dark)] hover:bg-[#fdf1f1]">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      colonnes={colonnes}
      lignes={table.lignes}
      meta={table.meta}
      chargement={table.chargement}
      erreur={table.erreur}
      recherche={table.recherche}
      onRecherche={table.setRecherche}
      onPage={table.setPage}
      cle={(o) => o.id}
      vide="Aucune offre."
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
  );
}

function Entreprises() {
  const table = useApiTable<AdminEntreprise>("/admin/emploi/entreprises");
  const [action, setAction] = useState<number | null>(null);

  async function verifier(e: AdminEntreprise, verifiee: boolean) {
    const avertissement = !verifiee
      ? `Retirer la vérification de « ${e.nom} » ? Ses offres publiées seront fermées.`
      : null;

    if (avertissement && !confirm(avertissement)) return;

    setAction(e.id);

    try {
      await api.put(`/admin/emploi/entreprises/${e.id}/verification`, { verifiee });
      await table.recharger();
    } catch (err) {
      table.setErreur(err instanceof ApiError ? err.message : "Modification impossible.");
    } finally {
      setAction(null);
    }
  }

  const colonnes: Colonne<AdminEntreprise>[] = [
    {
      cle: "nom",
      entete: "Entreprise",
      rendu: (e) => (
        <>
          <p className="font-semibold">{e.nom}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">
            {[e.secteur, e.ville].filter(Boolean).join(" · ") || "—"}
          </p>
        </>
      ),
    },
    { cle: "offres", entete: "Offres", masquer: "sm", rendu: (e) => e.offres_count },
    {
      cle: "verifiee",
      entete: "Vérification",
      rendu: (e) => (
        <button
          type="button"
          onClick={() => verifier(e, !e.verifiee)}
          disabled={action === e.id}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
            e.verifiee
              ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
              : "bg-[#fff8ed] text-[var(--sane-orange)]"
          }`}
        >
          {action === e.id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : e.verifiee ? (
            <BadgeCheck size={12} />
          ) : (
            <ShieldOff size={12} />
          )}
          {e.verifiee ? "Vérifiée" : "À vérifier"}
        </button>
      ),
    },
  ];

  return (
    <AdminTable
      colonnes={colonnes}
      lignes={table.lignes}
      meta={table.meta}
      chargement={table.chargement}
      erreur={table.erreur}
      recherche={table.recherche}
      onRecherche={table.setRecherche}
      onPage={table.setPage}
      cle={(e) => e.id}
      vide="Aucune entreprise."
    />
  );
}

function Entretiens() {
  const [filtreStatut, setFiltreStatut] = useState("");
  const table = useApiTable<ApiEntretien>("/admin/emploi/entretiens", { filtres: { statut: filtreStatut } });

  const colonnes: Colonne<ApiEntretien>[] = [
    {
      cle: "candidat",
      entete: "Candidat",
      rendu: (e) => (
        <>
          <p className="font-semibold">{e.candidature?.profil?.nom ?? "—"}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{e.candidature?.offre?.titre}</p>
        </>
      ),
    },
    {
      cle: "entreprise",
      entete: "Entreprise",
      masquer: "sm",
      rendu: (e) => e.candidature?.offre?.entreprise?.nom ?? "—",
    },
    {
      cle: "creneau",
      entete: "Créneau",
      masquer: "md",
      rendu: (e) =>
        e.creneau
          ? `${new Date(e.creneau.debut).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} · ${e.creneau.mode_label}`
          : "—",
    },
    {
      cle: "statut",
      entete: "Statut",
      rendu: (e) => (
        <span className="rounded-full bg-[var(--sane-background)] px-2.5 py-1 text-[11px] font-semibold text-[var(--sane-text)]">
          {e.statut_label}
        </span>
      ),
    },
  ];

  return (
    <AdminTable
      colonnes={colonnes}
      lignes={table.lignes}
      meta={table.meta}
      chargement={table.chargement}
      erreur={table.erreur}
      recherche={table.recherche}
      onRecherche={table.setRecherche}
      onPage={table.setPage}
      cle={(e) => e.id}
      vide="Aucun entretien."
      actions={
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          aria-label="Filtrer par statut"
          className="rounded-lg border border-[var(--sane-border)] bg-white px-3 py-2 text-[13px] outline-none focus:border-[var(--sane-green)]"
        >
          <option value="">Tous les statuts</option>
          {STATUTS_ENTRETIEN.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      }
    />
  );
}

export default function EmploiAdminPage() {
  const [onglet, setOnglet] = useState<"offres" | "entreprises" | "entretiens">("offres");

  return (
    <AdminPage section="Emploi" titre="Emploi" description="Modération des offres, vérification des entreprises et suivi des entretiens">
      <div className="mb-4 flex gap-2">
        {([["offres", "Offres"], ["entreprises", "Entreprises"], ["entretiens", "Entretiens"]] as const).map(([cle, label]) => (
          <button
            key={cle}
            type="button"
            onClick={() => setOnglet(cle)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
              onglet === cle ? "bg-[var(--sane-green)] text-white" : "bg-white text-[var(--sane-text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {onglet === "offres" ? <Offres /> : onglet === "entreprises" ? <Entreprises /> : <Entretiens />}
    </AdminPage>
  );
}
