"use client";

import React, { useState } from "react";
import {
  Home, Users, Briefcase, BookOpen, Calendar,
  Newspaper, BarChart3, Settings, Share2, Handshake,
  Eye, Pencil, Trash2, MoreVertical,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { adminNav } from "@/lib/adminNav";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { useTable } from "@/components/dashboard/useTable";
import RowActions from "@/components/dashboard/RowActions";
import TableDialogs from "@/components/dashboard/TableDialogs";
import StatsCard from "@/components/dashboard/StatsCard";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import DonutChart from "@/components/dashboard/DonutChart";
import RankedList from "@/components/dashboard/RankedList";
import DateBadgeList from "@/components/dashboard/DateBadgeList";
import PartnerLogo from "@/components/dashboard/PartnerLogo";

/* ─── Sidebar ─── */
const sidebarItems = adminNav("Partenaires", 0);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    value: "36", label: "Total des partenaires", trend: "+20%", trendLabel: "vs. année dernière", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    value: "18", label: "Partenaires actifs", trend: "+12%", trendLabel: "vs. année dernière", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
    value: "8", label: "Partenaires institutionnels", trend: "+33%", trendLabel: "vs. année dernière", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    value: "6", label: "Partenaires privés", trend: "+25%", trendLabel: "vs. année dernière", bg: "#F3E8FF", color: "#7C3AED",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    value: "12", label: "Partenaires internationaux", trend: "+14%", trendLabel: "vs. année dernière", bg: "#FFFBE8", color: "#D97706",
  },
];

/* ─── Table Data ─── */
const partenaires = [
  {
    id: 1, nom: "UNICEF",
    categorie: "Aide internationale", catColor: "#2563EB",
    pays: "Niger", flag: "🇳🇪", type: "Partenaire stratégique", typeColor: "#10632D",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "12 Mars 2024",
  },
  {
    id: 2, nom: "Banque Mondiale",
    categorie: "Institution financière", catColor: "#E57617",
    pays: "États-Unis", flag: "🇺🇸", type: "Partenaire financier", typeColor: "#E57617",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "10 Mars 2024",
  },
  {
    id: 3, nom: "AFD",
    categorie: "Coopération", catColor: "#DB2777",
    pays: "France", flag: "🇫🇷", type: "Partenaire technique", typeColor: "#7C3AED",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "08 Mars 2024",
  },
  {
    id: 4, nom: "GIZ",
    categorie: "Coopération", catColor: "#DB2777",
    pays: "Allemagne", flag: "🇩🇪", type: "Partenaire technique", typeColor: "#7C3AED",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "06 Mars 2024",
  },
  {
    id: 5, nom: "PNUD",
    categorie: "Organisation internationale", catColor: "#0891B2",
    pays: "Niger", flag: "🇳🇪", type: "Partenaire institutionnel", typeColor: "#0891B2",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "03 Mars 2024",
  },
  {
    id: 6, nom: "Enabel",
    categorie: "Coopération", catColor: "#DB2777",
    pays: "Belgique", flag: "🇧🇪", type: "Partenaire financier", typeColor: "#E57617",
    statut: "En attente", statutColor: "#D97706", statutBg: "#FFFBE8", date: "01 Mars 2024",
  },
  {
    id: 7, nom: "Union Européenne",
    categorie: "Institutionnelle", catColor: "#2563EB",
    pays: "Belgique", flag: "🇧🇪", type: "Partenaire stratégique", typeColor: "#10632D",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "28 Fév 2024",
  },
  {
    id: 8, nom: "OIT",
    categorie: "Organisation internationale", catColor: "#0891B2",
    pays: "Suisse", flag: "🇨🇭", type: "Partenaire technique", typeColor: "#7C3AED",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "26 Fév 2024",
  },
  {
    id: 9, nom: "BAD (Banque Africaine)",
    categorie: "Institution financière", catColor: "#E57617",
    pays: "Côte d'Ivoire", flag: "🇨🇮", type: "Partenaire financier", typeColor: "#E57617",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "24 Fév 2024",
  },
  {
    id: 10, nom: "TotalEnergies",
    categorie: "Secteur privé", catColor: "#61756B",
    pays: "France", flag: "🇫🇷", type: "Partenaire privé", typeColor: "#61756B",
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED", date: "20 Fév 2024",
  },
];

/* ─── Donut chart segments ─── */
const donutSegments = [
  { label: "Institutionnelle", value: 10, pct: 28, color: "#10632D" },
  { label: "Coopération", value: 8, pct: 22, color: "#2563EB" },
  { label: "Secteur privé", value: 6, pct: 18, color: "#E57617" },
  { label: "ONG", value: 4, pct: 12, color: "#7C3AED" },
  { label: "Institution financière", value: 4, pct: 10, color: "#0891B2" },
  { label: "Académique", value: 2, pct: 7, color: "#D97706" },
  { label: "Autres", value: 2, pct: 3, color: "#61756B" },
];

/* ─── Top partenaires ─── */
const topPartenairesData = [
  { rank: 1, title: "UNICEF", subtitle: "Partenaire stratégique" },
  { rank: 2, title: "Banque Mondiale", subtitle: "Partenaire financier" },
  { rank: 3, title: "AFD", subtitle: "Partenaire technique" },
  { rank: 4, title: "GIZ", subtitle: "Partenaire technique" },
  { rank: 5, title: "PNUD", subtitle: "Partenaire institutionnel" },
];

/* ─── Prochains renouvellements ─── */
const renouvellements = [
  { day: "15", month: "Avr", title: "GIZ", subtitle: "Fin du partenariat · Renouvellement à prévoir" },
  { day: "22", month: "Avr", title: "AFD", subtitle: "Fin du partenariat · Renouvellement à prévoir" },
  { day: "05", month: "Mai", title: "Banque Mondiale", subtitle: "Fin du partenariat · Renouvellement à prévoir" },
];

export default function PartenairesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(partenaires, { filterKeys: {"Catégorie":"categorie","Statut":"statut","Pays":"pays"} });
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher un partenaire, une entreprise, un secteur..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Hero Banner - light variant */}
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-white border border-[var(--sane-border)]">
            <div className="flex flex-col sm:flex-row">
              <div className="flex flex-col justify-center px-5 sm:px-8 py-5 relative z-10 sm:min-w-[45%]">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[var(--sane-text-light)]">
                  <span>Accueil</span>
                  <span>&rsaquo;</span>
                  <span>Partenaires</span>
                  <span>&rsaquo;</span>
                  <span className="font-semibold text-[var(--sane-green-deep)]">Tous les partenaires</span>
                </div>
                <h1 className="text-[28px] font-extrabold text-[var(--sane-green-deep)] leading-tight">Gestion des partenaires</h1>
                <p className="mt-1.5 max-w-[420px] text-[11px] text-[var(--sane-text-light)] leading-relaxed">
                  Gérez tous les partenaires du SANE. Ajoutez de nouveaux partenaires,<br />
                  organisez-les par catégorie et suivez leurs contributions.
                </p>
              </div>
              <div className="relative h-[110px] sm:h-auto sm:flex-1 sm:min-h-[160px]">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop"
                  alt="partenaires"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
                <div className="absolute right-[110px] top-1/2 -translate-y-1/2 opacity-60 hidden sm:block">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="#10632D" opacity="0.08" />
                    <circle cx="50" cy="50" r="45" stroke="#E57617" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="6 3" />
                    <text x="50" y="48" textAnchor="middle" fill="#10632D" fontSize="18" fontWeight="800">SANE</text>
                    <text x="50" y="60" textAnchor="middle" fill="#10632D" fontSize="5" fontWeight="600" letterSpacing="0.5">SALON NATIONAL DE L&apos;EMPLOI</text>
                  </svg>
                </div>
                <div className="absolute right-5 bottom-3 text-right hidden sm:block">
                  <p className="text-[18px] italic font-bold text-[var(--sane-green)] leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                    Un Niger<br />de Talents
                  </p>
                </div>
              </div>
            </div>
            <button type="button" onClick={tbl.openAdd} className="absolute right-10 top-5 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter un partenaire
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} trendLabel={s.trendLabel} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_280px]">
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3 min-w-0">
              <FilterBar searchPlaceholder="Rechercher un partenaire..." filters={["Catégorie", "Type de partenariat", "Pays", "Statut"]}  table={tbl} />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Logo</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Nom du partenaire <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Catégorie</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Pays <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Type de partenariat <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date d&apos;ajout <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((p) => (
                      <tr key={p.id} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.selected.includes(p._uid)} onChange={() => tbl.toggle(p._uid)} /></td>
                        <td className="px-2 py-2">
                          <PartnerLogo nom={p.nom} />
                        </td>
                        <td className="px-2 py-2">
                          <p className="whitespace-nowrap text-[12px] font-semibold text-[var(--sane-green-deep)]">{p.nom}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `${p.catColor}18`, color: p.catColor }}>
                            {p.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[13px]">{p.flag}</span>
                            <p className="text-[11px] text-[var(--sane-green-deep)] font-medium whitespace-nowrap">{p.pays}</p>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `${p.typeColor}18`, color: p.typeColor }}>
                            {p.type}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: p.statutBg, color: p.statutColor }}>
                            {p.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[11px] text-[var(--sane-green-deep)] font-medium whitespace-nowrap">{p.date}</p>
                        </td>
                        <td className="px-2 py-2">
                          <RowActions table={tbl} row={p} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="partenaires" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:flex 2xl:flex-col gap-3 min-w-0">
              <DonutChart title="Répartition par catégorie" segments={donutSegments} centerValue="36" centerLabel="Partenaires" showValues={false} />
              <RankedList heading="Top partenaires actifs" items={topPartenairesData} showViewAll />
              <DateBadgeList heading="Prochains renouvellements" items={renouvellements} showViewAll />
            </div>
          </div>

        </main>
      </div>
      <TableDialogs table={tbl} entity="partenaire" />
    </div>
  );
}
