"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { api, ApiError, telecharger } from "@/lib/api";

interface Statistiques {
  edition: { id: number; annee: number; nom: string } | null;
  inscriptions: {
    total: number;
    en_attente: number;
    confirmee: number;
    annulee: number;
    par_type: { valeur: string; label: string; total: number }[];
    par_ville: { valeur: string; total: number }[];
  };
  formations: {
    total: number;
    publiees: number;
    places_totales: number;
    places_prises: number;
    les_plus_demandees: { titre: string; inscrits: number; places: number }[];
  };
  emploi: {
    offres: { total: number; publiees: number; vues: number };
    candidatures: Record<string, number>;
    entreprises: { total: number; verifiees: number };
    demandeurs: { total: number; visibles: number };
    entretiens: number;
  };
  utilisateurs: { total: number; actifs: number; par_role: Record<string, number> };
  activite: { jour: string; total: number }[];
}

function Tuile({ valeur, label, accent }: { valeur: number | string; label: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
      <p className="text-[24px] font-bold leading-none" style={{ color: accent ?? "var(--sane-text)" }}>
        {valeur}
      </p>
      <p className="mt-1 text-[12px] text-[var(--sane-text-light)]">{label}</p>
    </div>
  );
}

function Barres({ donnees }: { donnees: { valeur: string; total: number }[] }) {
  const max = Math.max(1, ...donnees.map((d) => d.total));

  return (
    <ul className="flex flex-col gap-2">
      {donnees.map((d) => (
        <li key={d.valeur} className="flex items-center gap-3">
          <span className="w-[120px] shrink-0 truncate text-[12px] text-[var(--sane-text)]">{d.valeur}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--sane-background)]">
            <span
              className="block h-full rounded-full bg-[var(--sane-green)]"
              style={{ width: `${(d.total / max) * 100}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-[12px] font-semibold">{d.total}</span>
        </li>
      ))}
    </ul>
  );
}

function Contenu() {
  const [stats, setStats] = useState<Statistiques | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let actif = true;

    api
      .get<Statistiques>("/admin/statistiques")
      .then((res) => actif && setStats(res))
      .catch((e) => actif && setErreur(e instanceof ApiError ? e.message : "Chargement impossible."))
      .finally(() => actif && setChargement(false));

    return () => {
      actif = false;
    };
  }, []);

  if (chargement) {
    return (
      <p className="flex items-center gap-2 py-12">
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="text-[13px] text-[var(--sane-text-light)]">Chargement des statistiques…</span>
      </p>
    );
  }

  if (erreur || !stats) {
    return (
      <p role="alert" className="flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] p-4">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
        <span className="text-[13px] text-[var(--sane-red-dark)]">{erreur ?? "Aucune donnée."}</span>
      </p>
    );
  }

  const tauxRemplissage = stats.formations.places_totales
    ? Math.round((stats.formations.places_prises / stats.formations.places_totales) * 100)
    : 0;

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { label: "Inscriptions", url: "/admin/exports/inscriptions", fichier: "inscriptions.xlsx" },
          { label: "Candidatures", url: "/admin/exports/candidatures", fichier: "candidatures.xlsx" },
          { label: "Offres", url: "/admin/exports/offres", fichier: "offres.xlsx" },
        ].map((e) => (
          <button
            key={e.label}
            type="button"
            onClick={() => telecharger(e.url, e.fichier)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--sane-border)] bg-white px-4 py-2 text-[13px] font-semibold hover:border-[var(--sane-green)]"
          >
            <Download size={15} /> {e.label}
          </button>
        ))}
      </div>

      <h2 className="mb-3 text-[15px] font-bold text-[var(--sane-text)]">
        Inscriptions {stats.edition && `— édition ${stats.edition.annee}`}
      </h2>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile valeur={stats.inscriptions.total} label="Total" />
        <Tuile valeur={stats.inscriptions.confirmee} label="Confirmées" accent="var(--sane-green)" />
        <Tuile valeur={stats.inscriptions.en_attente} label="En attente" accent="var(--sane-orange)" />
        <Tuile valeur={stats.inscriptions.annulee} label="Annulées" accent="var(--sane-red-dark)" />
      </div>

      <h2 className="mb-3 text-[15px] font-bold text-[var(--sane-text)]">Formations</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile valeur={stats.formations.total} label="Formations" />
        <Tuile valeur={stats.formations.publiees} label="Publiées" />
        <Tuile valeur={`${stats.formations.places_prises}/${stats.formations.places_totales}`} label="Places prises" />
        <Tuile valeur={`${tauxRemplissage}%`} label="Taux de remplissage" accent="var(--sane-green)" />
      </div>

      <h2 className="mb-3 text-[15px] font-bold text-[var(--sane-text)]">Emploi</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile valeur={stats.emploi.offres.publiees} label="Offres publiées" />
        <Tuile valeur={stats.emploi.candidatures.total ?? 0} label="Candidatures" accent="var(--sane-orange)" />
        <Tuile valeur={`${stats.emploi.entreprises.verifiees}/${stats.emploi.entreprises.total}`} label="Entreprises vérifiées" />
        <Tuile valeur={stats.emploi.entretiens} label="Entretiens" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {stats.inscriptions.par_ville.length > 0 && (
          <section className="rounded-2xl border border-[var(--sane-border)] bg-white p-5">
            <h3 className="mb-4 text-[14px] font-bold text-[var(--sane-text)]">Inscriptions par ville</h3>
            <Barres donnees={stats.inscriptions.par_ville} />
          </section>
        )}

        {stats.formations.les_plus_demandees.length > 0 && (
          <section className="rounded-2xl border border-[var(--sane-border)] bg-white p-5">
            <h3 className="mb-4 text-[14px] font-bold text-[var(--sane-text)]">Formations les plus demandées</h3>
            <Barres
              donnees={stats.formations.les_plus_demandees.map((f) => ({
                valeur: f.titre,
                total: f.inscrits,
              }))}
            />
          </section>
        )}
      </div>
    </>
  );
}

export default function RapportsAdminPage() {
  return (
    <AdminPage
      section="Rapports"
      titre="Rapports et statistiques"
      description="Vue d'ensemble de la plateforme et exports de données"
    >
      <Contenu />
    </AdminPage>
  );
}
