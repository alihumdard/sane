"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Award, BookOpen, Briefcase, Building2, CalendarDays,
  FileText, Mic, UserCheck, Users,
} from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { BandeauBienvenue, ChiffreBandeau } from "@/components/dashboard/BandeauBienvenue";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { SectionTableau } from "@/components/dashboard/SectionTableau";
import { Spinner } from "@/components/dashboard/Spinner";
import { api, ApiError } from "@/lib/api";

interface Statistiques {
  edition: { annee: number } | null;
  inscriptions: { total: number; confirmee: number; en_attente: number };
  formations: { total: number; places_prises: number; places_totales: number };
  emploi: {
    offres: { publiees: number };
    candidatures: { total: number };
    entreprises: { total: number; verifiees: number };
    entretiens: number;
  };
  utilisateurs: { total: number };
}

/** The things an organiser opens most, in the order they usually need them. */
const RACCOURCIS = [
  { href: "/dashboard/admin/inscriptions", label: "Inscriptions", icone: FileText, accent: "var(--sane-green)", fond: "var(--sane-green-tint)" },
  { href: "/dashboard/admin/formations", label: "Formations", icone: BookOpen, accent: "var(--sane-orange)", fond: "var(--sane-orange-tint)" },
  { href: "/dashboard/admin/evenements", label: "Éditions", icone: CalendarDays, accent: "var(--sane-blue)", fond: "var(--sane-blue-tint)" },
  { href: "/dashboard/admin/intervenants", label: "Intervenants", icone: Mic, accent: "#0d9488", fond: "#e6f6f4" },
  { href: "/dashboard/admin/emploi", label: "Offres d'emploi", icone: Briefcase, accent: "var(--sane-green)", fond: "var(--sane-green-tint)" },
  { href: "/dashboard/admin/utilisateurs", label: "Utilisateurs", icone: Users, accent: "var(--sane-orange)", fond: "var(--sane-orange-tint)" },
];

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

  const places = stats
    ? stats.formations.places_prises + " / " + stats.formations.places_totales
    : "—";

  return (
    <>
      <BandeauBienvenue sousTitre="Voici l'état du salon : inscriptions, offres d'emploi, formations et contenus du site public.">
        <div className="flex flex-wrap gap-2.5">
          <ChiffreBandeau valeur={stats?.edition?.annee ?? "—"} label="Édition en cours" />
          <ChiffreBandeau valeur={stats?.inscriptions.en_attente ?? 0} label="À valider" />
          <ChiffreBandeau valeur={places} label="Places prises" />
        </div>
      </BandeauBienvenue>

      <Alerte texte={erreur} className="mb-5" />

      <SectionTableau
        titre="Accès rapide"
        description="Les sections ouvertes le plus souvent."
      >
        <div className="flex flex-wrap gap-2.5">
          {RACCOURCIS.map(({ href, label, icone: Icone, accent, fond }) => (
            <Link
              key={href}
              href={href}
              className="group inline-flex items-center gap-2.5 rounded-xl border border-[var(--sane-border)] bg-white py-2 pl-2 pr-4 text-[13px] font-semibold text-[var(--sane-text)] transition-all hover:-translate-y-0.5 hover:border-[var(--sane-green-muted)] hover:text-[var(--sane-green)] hover:shadow-sm"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                style={{ backgroundColor: fond, color: accent }}
              >
                <Icone size={16} />
              </span>
              {label}
            </Link>
          ))}
        </div>
      </SectionTableau>

      <SectionTableau
        titre="Participation"
        description="Qui s'est inscrit au salon, et qui a un compte sur la plateforme."
        action={<Spinner actif={chargement} className="text-[var(--sane-green)]" />}
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardStatCard rang={0}
            icon={<FileText size={20} />} value={stats?.inscriptions.total ?? 0} label="Inscriptions au salon"
            accent="green" href="/dashboard/admin/inscriptions"
            note={stats?.inscriptions.en_attente ? stats.inscriptions.en_attente + " à valider" : undefined}
          />
          <DashboardStatCard rang={1}
            icon={<Users size={20} />} value={stats?.utilisateurs.total ?? 0} label="Comptes utilisateurs"
            accent="blue" href="/dashboard/admin/utilisateurs"
          />
          <DashboardStatCard rang={2}
            icon={<BookOpen size={20} />} value={stats?.formations.total ?? 0} label="Formations au catalogue"
            accent="orange" href="/dashboard/admin/formations"
            note={stats ? places + " places prises" : undefined}
          />
          <DashboardStatCard rang={3}
            icon={<Award size={20} />} value={stats?.edition?.annee ?? "—"} label="Édition en cours"
            accent="teal" href="/dashboard/admin/evenements"
          />
        </div>
      </SectionTableau>

      <SectionTableau
        titre="Emploi"
        description="Les offres publiées, les entreprises qui recrutent et le suivi des candidatures."
        lien={{ href: "/dashboard/admin/emploi", label: "Ouvrir la section Emploi" }}
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardStatCard rang={0}
            icon={<Briefcase size={20} />} value={stats?.emploi.offres.publiees ?? 0} label="Offres d'emploi publiées"
            accent="green" href="/dashboard/admin/emploi"
          />
          <DashboardStatCard rang={1}
            icon={<UserCheck size={20} />} value={stats?.emploi.candidatures.total ?? 0} label="Candidatures reçues"
            accent="orange" href="/dashboard/admin/candidatures"
          />
          <DashboardStatCard rang={2}
            icon={<Building2 size={20} />} value={stats?.emploi.entreprises.total ?? 0} label="Entreprises inscrites"
            accent="blue" href="/dashboard/admin/emploi?onglet=entreprises"
            note={stats?.emploi.entreprises.verifiees ? stats.emploi.entreprises.verifiees + " vérifiée(s)" : undefined}
          />
          <DashboardStatCard rang={3}
            icon={<Mic size={20} />} value={stats?.emploi.entretiens ?? 0} label="Entretiens planifiés"
            accent="teal" href="/dashboard/admin/emploi?onglet=entretiens"
          />
        </div>
      </SectionTableau>

      <p className="text-[12.5px] text-[var(--sane-text-light)]">
        Pour le détail et les exports, voir{" "}
        <Link href="/dashboard/admin/rapports" className="font-semibold text-[var(--sane-green)] hover:underline">
          Rapports et statistiques
        </Link>
        .
      </p>
    </>
  );
}

export default function AdminHome() {
  return (
    <AdminPage
      section="Tableau de bord"
      titre="Tableau de bord"
      description="Vue d'ensemble et accès rapide aux sections"
    >
      <Contenu />
    </AdminPage>
  );
}
