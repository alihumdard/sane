"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Briefcase, CheckCircle2, Eye, FileText, Loader2, ShieldAlert, Users } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { RecruteurLayout } from "@/components/recruteur/RecruteurLayout";
import { api, ApiError } from "@/lib/api";
import type { TableauBordEntreprise } from "@/lib/types";

const STATUT_COULEUR: Record<string, string> = {
  envoyee: "bg-[var(--sane-background)] text-[var(--sane-text-light)]",
  en_revue: "bg-[var(--sane-blue-tint)] text-[var(--sane-blue)]",
  preselectionnee: "bg-[var(--sane-orange-tint)] text-[var(--sane-orange)]",
  entretien: "bg-[var(--sane-green-tint)] text-[var(--sane-green)]",
  acceptee: "bg-[var(--sane-green-tint)] text-[var(--sane-green)]",
  refusee: "bg-[#fdf1f1] text-[var(--sane-red-dark)]",
};

function Contenu() {
  const [data, setData] = useState<TableauBordEntreprise | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let actif = true;

    api
      .get<TableauBordEntreprise>("/entreprise/tableau-de-bord")
      .then((res) => actif && setData(res))
      .catch((e) => {
        if (!actif) return;
        setErreur(e instanceof ApiError ? e.message : "Impossible de charger le tableau de bord.");
      })
      .finally(() => actif && setChargement(false));

    return () => {
      actif = false;
    };
  }, []);

  if (chargement) {
    return (
      <p className="flex items-center gap-2 py-12">
        <Loader2 size={18} className="animate-spin text-[var(--sane-green)]" />
        <span className="text-[13px] text-[var(--sane-text-light)]">Chargement…</span>
      </p>
    );
  }

  if (erreur) {
    return (
      <p role="alert" className="flex items-start gap-2 rounded-xl border border-[var(--sane-red-dark)] p-4">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--sane-red-dark)]" />
        <span className="text-[13px] text-[var(--sane-red-dark)]">{erreur}</span>
      </p>
    );
  }

  // No company record yet — nothing else on this page can work without one.
  if (!data?.entreprise) {
    return (
      <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-6 text-center">
        <Briefcase size={28} className="mx-auto mb-3 text-[var(--sane-green)]" />
        <h2 className="mb-1 text-[16px] font-bold text-[var(--sane-text)]">
          Créez le profil de votre entreprise
        </h2>
        <p className="mx-auto mb-4 max-w-[420px] text-[13px] text-[var(--sane-text-light)]">
          Renseignez votre entreprise pour pouvoir publier des offres et recevoir des candidatures.
        </p>
        <Link
          href="/dashboard/recruteur/entreprise"
          className="inline-block rounded-lg bg-[var(--sane-orange)] px-5 py-2.5 text-[13px] font-bold text-white"
        >
          Renseigner mon entreprise
        </Link>
      </div>
    );
  }

  return (
    <>
      {!data.entreprise.verifiee && (
        <p className="mb-5 flex items-start gap-2.5 rounded-xl border border-[var(--sane-orange)] bg-[#fff8ed] p-4">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-[var(--sane-orange)]" />
          <span className="text-[13px] text-[var(--sane-text)]">
            Votre entreprise est en attente de vérification. Vous pouvez préparer vos offres en
            brouillon&nbsp;; leur publication sera possible dès la validation par les organisateurs.
          </span>
        </p>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardStatCard
          icon={<Briefcase size={20} />} value={data.offres?.publiees ?? 0} label="Offres publiées"
          accent="green" href="/dashboard/recruteur/offres"
        />
        <DashboardStatCard
          icon={<FileText size={20} />} value={data.candidatures?.total ?? 0} label="Candidatures reçues"
          accent="orange" href="/dashboard/recruteur/candidatures"
          note={data.candidatures?.nouvelles ? `${data.candidatures.nouvelles} nouvelle(s)` : undefined}
        />
        <DashboardStatCard icon={<Users size={20} />} value={data.candidatures?.nouvelles ?? 0} label="Nouvelles candidatures" accent="blue" href="/dashboard/recruteur/candidatures" />
        <DashboardStatCard icon={<Eye size={20} />} value={data.offres?.vues ?? 0} label="Vues des offres" accent="teal" href="/dashboard/recruteur/offres" />
      </div>

      <section className="rounded-2xl border border-[var(--sane-border)] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[var(--sane-text)]">Candidatures récentes</h2>
          <Link href="/dashboard/recruteur/candidatures" className="text-[12px] font-semibold text-[var(--sane-green)]">
            Tout voir →
          </Link>
        </div>

        {!data.recentes?.length ? (
          <p className="py-6 text-center text-[13px] text-[var(--sane-text-light)]">
            Aucune candidature pour le moment.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-[var(--sane-border)]">
            {data.recentes.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sane-green-tint)] text-[12px] font-bold text-[var(--sane-green)]">
                    {(c.profil?.nom ?? "C").charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[var(--sane-text)]">
                      {c.profil?.nom ?? "Candidat"}
                    </p>
                    <p className="truncate text-[12px] text-[var(--sane-text-light)]">{c.offre?.titre}</p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUT_COULEUR[c.statut] ?? STATUT_COULEUR.envoyee}`}>
                  {c.statut_label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(data.candidatures?.acceptees ?? 0) > 0 && (
        <p className="mt-5 flex items-center gap-2 text-[13px] text-[var(--sane-text-light)]">
          <CheckCircle2 size={15} className="text-[var(--sane-green)]" />
          {data.candidatures?.acceptees} candidature(s) acceptée(s) à ce jour.
        </p>
      )}
    </>
  );
}

export default function RecruteurDashboardPage() {
  return (
    <RecruteurLayout titre="Tableau de bord" description="Vue d'ensemble de votre recrutement">
      <Contenu />
    </RecruteurLayout>
  );
}
