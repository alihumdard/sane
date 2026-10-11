"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { AdminTable, type Colonne } from "@/components/dashboard/AdminTable";
import { useApiTable } from "@/components/dashboard/useApiTable";
import { telecharger } from "@/lib/api";
import type { ApiCandidature } from "@/lib/types";

const STATUTS = [
  { value: "envoyee", label: "Envoyée" },
  { value: "en_revue", label: "En revue" },
  { value: "preselectionnee", label: "Présélectionnée" },
  { value: "entretien", label: "Entretien" },
  { value: "acceptee", label: "Acceptée" },
  { value: "refusee", label: "Refusée" },
];

function Contenu() {
  const [filtreStatut, setFiltreStatut] = useState("");
  const table = useApiTable<ApiCandidature>("/admin/emploi/candidatures", {
    filtres: { statut: filtreStatut },
  });

  const colonnes: Colonne<ApiCandidature>[] = [
    {
      cle: "candidat",
      entete: "Candidat",
      rendu: (c) => (
        <>
          <p className="font-semibold">{c.profil?.nom ?? "—"}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{c.reference}</p>
        </>
      ),
    },
    {
      cle: "offre",
      entete: "Offre",
      masquer: "sm",
      rendu: (c) => (
        <>
          <p>{c.offre?.titre}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">{c.offre?.entreprise?.nom}</p>
        </>
      ),
    },
    {
      cle: "statut",
      entete: "Statut",
      rendu: (c) => (
        <span className="rounded-full bg-[var(--sane-background)] px-2.5 py-1 text-[11px] font-semibold">
          {c.statut_label}
        </span>
      ),
    },
    {
      cle: "cv",
      entete: "CV",
      masquer: "md",
      // Organisers may read any CV, which the API authorises by role.
      rendu: (c) =>
        c.cv ? (
          <button
            type="button"
            onClick={() => telecharger(`/documents-candidature/${c.cv!.id}/telecharger`, c.cv!.nom_original)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--sane-green)]"
          >
            <Download size={13} /> CV
          </button>
        ) : (
          <span className="text-[12px] text-[var(--sane-text-light)]">—</span>
        ),
    },
    {
      cle: "date",
      entete: "Postulé le",
      masquer: "lg",
      rendu: (c) => new Date(c.created_at).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltreStatut("")}
          className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
            filtreStatut === "" ? "bg-[var(--sane-green)] text-white" : "bg-white"
          }`}
        >
          Toutes ({table.resume.total ?? 0})
        </button>
        {STATUTS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setFiltreStatut(s.value)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
              filtreStatut === s.value ? "bg-[var(--sane-green)] text-white" : "bg-white"
            }`}
          >
            {s.label} ({table.resume[s.value] ?? 0})
          </button>
        ))}
      </div>

      <AdminTable
        colonnes={colonnes}
        lignes={table.lignes}
        meta={table.meta}
        chargement={table.chargement}
        erreur={table.erreur}
        recherche={table.recherche}
        onRecherche={table.setRecherche}
        onPage={table.setPage}
        cle={(c) => c.id}
        vide="Aucune candidature."
        actions={
          <button
            type="button"
            onClick={() => telecharger("/admin/exports/candidatures", "candidatures.csv")}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--sane-border)] bg-white px-4 py-2 text-[13px] font-semibold hover:border-[var(--sane-green)]"
          >
            <Download size={15} /> Exporter CSV
          </button>
        }
      />
    </>
  );
}

export default function CandidaturesAdminPage() {
  return (
    <AdminPage
      section="Emploi"
      titre="Candidatures"
      description="Suivi des candidatures sur l'ensemble de la plateforme"
    >
      <Contenu />
    </AdminPage>
  );
}
