"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle, BookOpen, Briefcase, CalendarDays,
  FileText, Mic, Users,
} from "lucide-react";
import { Alerte } from "@/components/ui/Alerte";
import { AdminPage } from "@/components/dashboard/AdminPage";
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
  { href: "/dashboard/admin/inscriptions", label: "Inscriptions", icone: FileText },
  { href: "/dashboard/admin/formations", label: "Formations", icone: BookOpen },
  { href: "/dashboard/admin/evenements", label: "Éditions", icone: CalendarDays },
  { href: "/dashboard/admin/intervenants", label: "Intervenants", icone: Mic },
  { href: "/dashboard/admin/emploi", label: "Offres d'emploi", icone: Briefcase },
  { href: "/dashboard/admin/utilisateurs", label: "Utilisateurs", icone: Users },
];

function Tuile({ valeur, label }: { valeur: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-4">
      <p className="text-[24px] font-bold leading-none text-[var(--sane-text)]">{valeur}</p>
      <p className="mt-1 text-[12px] text-[var(--sane-text-light)]">{label}</p>
    </div>
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

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {RACCOURCIS.map(({ href, label, icone: Icone }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--sane-border)] bg-white px-4 py-2.5 text-[13px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]"
          >
            <Icone size={15} /> {label}
          </Link>
        ))}
      </div>

      <Alerte texte={erreur} className="mb-4" />

      <p className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[var(--sane-text)]">
        En un coup d&apos;œil
        {chargement && <Spinner actif className="text-[var(--sane-green)]" />}
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile valeur={stats?.inscriptions.total ?? 0} label="Inscriptions" />
        <Tuile valeur={stats?.inscriptions.en_attente ?? 0} label="À valider" />
        <Tuile valeur={stats?.formations.total ?? 0} label="Formations" />
        <Tuile
          valeur={`${stats?.formations.places_prises ?? 0}/${stats?.formations.places_totales ?? 0}`}
          label="Places prises"
        />
        <Tuile valeur={stats?.emploi.offres.publiees ?? 0} label="Offres publiées" />
        <Tuile valeur={stats?.emploi.candidatures.total ?? 0} label="Candidatures" />
        <Tuile valeur={stats?.emploi.entretiens ?? 0} label="Entretiens" />
        <Tuile valeur={stats?.utilisateurs.total ?? 0} label="Utilisateurs" />
      </div>

      <p className="text-[12px] text-[var(--sane-text-light)]">
        Pour le détail et les exports, voir{" "}
        <Link href="/dashboard/admin/rapports" className="font-semibold text-[var(--sane-green)]">
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
