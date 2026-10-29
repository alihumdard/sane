"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, EyeOff, Pencil, Plus, Trash2, Users } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { AdminTable, type Colonne } from "@/components/dashboard/AdminTable";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DialogueConfirmation } from "@/components/dashboard/DialogueConfirmation";
import { Publie } from "@/components/dashboard/Publie";
import { useApiTable } from "@/components/dashboard/useApiTable";
import { useMessageEnregistrement } from "@/components/dashboard/messageEnregistrement";
import { Alerte } from "@/components/ui/Alerte";
import { api, ApiError } from "@/lib/api";
import type { ApiFormation } from "@/lib/types";
import { FORMATS, NIVEAUX } from "./listes";

const BASE = "/dashboard/admin/formations";


const selectClass =
  "h-11 rounded-xl border border-[var(--sane-border)] bg-white px-3.5 text-[12.5px] font-medium text-[var(--sane-text)] outline-none transition-all hover:border-[var(--sane-green-muted)] focus:border-[var(--sane-green-muted)] focus:ring-4 focus:ring-[var(--sane-green)]/8";

/**
 * The course catalogue.
 *
 * It used to run on a local table hook that sorted, filtered and paginated a
 * single array held in the browser, with a reflecting dialog that built its
 * own fields from whichever keys the first row happened to have. Search and
 * pagination now resolve on the server, and the form is a page of its own.
 */
export default function FormationsAdminPage() {
  // Declared and offered: the two filters were passed to the table with no
  // control to set them, so the API's support for them went unused.
  const [filtreNiveau, setFiltreNiveau] = useState("");
  const [filtreFormat, setFiltreFormat] = useState("");

  const table = useApiTable<ApiFormation>("/admin/formations", {
    filtres: { niveau: filtreNiveau, format: filtreFormat },
  });
  const enregistre = useMessageEnregistrement(BASE);

  const [aSupprimer, setASupprimer] = useState<ApiFormation | null>(null);
  const [suppression, setSuppression] = useState(false);

  const resume = useMemo(() => {
    const lignes = table.lignes;

    return {
      publiees: lignes.filter((f) => f.publiee).length,
      inscrits: lignes.reduce((n, f) => n + f.inscriptions_count, 0),
      completes: lignes.filter((f) => f.complete).length,
    };
  }, [table.lignes]);

  async function supprimer() {
    if (!aSupprimer) return;

    setSuppression(true);

    try {
      await api.delete("/admin/formations/" + aSupprimer.id);
      setASupprimer(null);
      await table.recharger();
    } catch (e) {
      table.setErreur(e instanceof ApiError ? e.message : "Suppression impossible.");
      setASupprimer(null);
    } finally {
      setSuppression(false);
    }
  }

  const colonnes: Colonne<ApiFormation>[] = [
    {
      cle: "titre",
      entete: "Formation",
      rendu: (f) => (
        <div className="min-w-0">
          <p className="font-semibold">{f.titre}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">
            {f.categorie?.nom ?? "Sans catégorie"} · {f.lieu}
          </p>
        </div>
      ),
    },
    {
      cle: "intervenant",
      entete: "Intervenant",
      masquer: "lg",
      rendu: (f) => f.formateur?.nom ?? "—",
    },
    {
      cle: "format",
      entete: "Niveau / format",
      masquer: "md",
      rendu: (f) => (
        <>
          <p>{f.niveau}</p>
          <p className="text-[12px] text-[var(--sane-text-light)]">
            {f.format} · {f.duree}
          </p>
        </>
      ),
    },
    {
      cle: "inscriptions",
      entete: "Inscriptions",
      masquer: "sm",
      rendu: (f) => (
        <div className="min-w-[90px]">
          <p className="whitespace-nowrap font-semibold">
            {f.inscriptions_count} / {f.max_inscriptions}
          </p>
          <span
            aria-hidden
            className="mt-1 block h-1.5 w-full max-w-[90px] overflow-hidden rounded-full bg-[var(--sane-border)]"
          >
            <span
              className={
                "block h-full rounded-full " +
                (f.complete ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-green)]")
              }
              style={{ width: Math.min(100, f.taux_remplissage) + "%" }}
            />
          </span>
        </div>
      ),
    },
    {
      cle: "statut",
      entete: "Statut",
      masquer: "md",
      rendu: (f) =>
        f.complete && f.publiee ? (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--sane-purple-tint)] px-2.5 py-1 text-[11px] font-semibold text-[var(--sane-purple)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--sane-purple)]" />
            Complète
          </span>
        ) : (
          <Publie actif={f.publiee} oui="Publiée" non="Brouillon" />
        ),
    },
    {
      cle: "_actions",
      entete: "Actions",
      fin: true,
      rendu: (f) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={BASE + "/" + f.id}
            title="Modifier"
            aria-label={"Modifier : " + f.titre}
            className="rounded-lg p-2 text-[var(--sane-text-light)] transition-colors hover:bg-[var(--sane-green-light)] hover:text-[var(--sane-green)]"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            onClick={() => setASupprimer(f)}
            title="Supprimer"
            aria-label={"Supprimer : " + f.titre}
            className="rounded-lg p-2 text-[var(--sane-text-light)] transition-colors hover:bg-[#fdf1f1] hover:text-[var(--sane-red-dark)]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPage
      titre="Formations"
      description="Le catalogue affiché sur la page Formations. Les places restantes se mettent à jour à chaque inscription validée."
      actions={
        <Link
          href={BASE + "/nouveau"}
          className="group inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--sane-orange)] px-5 text-[13px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(229,118,23,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[var(--sane-orange-dark)] hover:shadow-[0_10px_22px_-6px_rgba(229,118,23,0.85)]"
        >
          <Plus size={15} /> Ajouter une formation
        </Link>
      }
    >
      <DialogueConfirmation
        ouvert={aSupprimer !== null}
        titre="Supprimer cette formation ?"
        message={
          aSupprimer
            ? "« " +
              aSupprimer.titre +
              " » et ses " +
              aSupprimer.inscriptions_count +
              " inscription(s) seront retirées. Cette action est définitive."
            : ""
        }
        enCours={suppression}
        onConfirmer={supprimer}
        onAnnuler={() => setASupprimer(null)}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardStatCard
          icon={<BookOpen size={20} />}
          value={table.meta?.total ?? 0}
          label="Formations au catalogue"
          accent="green"
        />
        <DashboardStatCard icon={<CheckCircle2 size={20} />} value={resume.publiees} label="Publiées sur cette page" accent="blue" />
        <DashboardStatCard icon={<Users size={20} />} value={resume.inscrits} label="Inscriptions sur cette page" accent="orange" />
        <DashboardStatCard icon={<EyeOff size={20} />} value={resume.completes} label="Complètes" accent="teal" />
      </div>

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
        cle={(f) => f.id}
        vide="Aucune formation au catalogue. Ajoutez-en une pour remplir la page Formations."
        rechercheLabel="Rechercher une formation…"
        filtres={
          <>
            <select
              value={filtreNiveau}
              onChange={(e) => setFiltreNiveau(e.target.value)}
              aria-label="Filtrer par niveau"
              className={selectClass}
            >
              <option value="">Tous les niveaux</option>
              {NIVEAUX.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <select
              value={filtreFormat}
              onChange={(e) => setFiltreFormat(e.target.value)}
              aria-label="Filtrer par format"
              className={selectClass}
            >
              <option value="">Tous les formats</option>
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </>
        }
      />
    </AdminPage>
  );
}
