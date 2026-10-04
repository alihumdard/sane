"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar,
  Newspaper, BarChart3, Settings, Share2,
  Eye, Pencil, Link2, Trash2, MoreVertical,
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

/* ─── Sidebar ─── */
const sidebarItems = adminNav("Événements", 0);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>,
    value: "12", label: "Événements", trend: "+20%", trendLabel: "vs. année dernière", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "5,860", label: "Inscriptions", trend: "+35%", trendLabel: "vs. année dernière", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>,
    value: "46", label: "Intervenants", trend: "+12%", trendLabel: "vs. année dernière", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
    value: "8", label: "Lieux", trend: "+14%", trendLabel: "vs. année dernière", bg: "#F3E8FF", color: "#7C3AED",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
    value: "36", label: "Sessions", trend: "+28%", trendLabel: "vs. année dernière", bg: "#FFFBE8", color: "#D97706",
  },
];

/* ─── Table Data ─── */
const evenements = [
  {
    id: "#EVT001", titre: "Salon National de l'Emploi 2024", categorie: "Salon", catColor: "#10632D",
    lieu: "Palais des Congrès\nNiamey", date: "12 - 14 Mai 2024",
    inscriptions: 2860, maxInscriptions: 3000, inscPct: 95,
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT002", titre: "Forum sur l'Entrepreneuriat", categorie: "Forum", catColor: "#E57617",
    lieu: "Centre de Conférences\nNiamey", date: "22 Mars 2024",
    inscriptions: 420, maxInscriptions: 500, inscPct: 84,
    statut: "En cours", statutColor: "#D97706", statutBg: "#FFFBE8",
    img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT003", titre: "Conférence : Jeunes et Emploi", categorie: "Conférence", catColor: "#2563EB",
    lieu: "Université de Niamey\nNiamey", date: "18 Avril 2024",
    inscriptions: 320, maxInscriptions: 400, inscPct: 80,
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT004", titre: "Atelier : Compétences Numériques", categorie: "Atelier", catColor: "#7C3AED",
    lieu: "Maison des Jeunes\nNiamey", date: "05 Mai 2024",
    inscriptions: 180, maxInscriptions: 200, inscPct: 90,
    statut: "Complet", statutColor: "#7C3AED", statutBg: "#F3E8FF",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT005", titre: "Rencontre avec les Recruteurs", categorie: "Rencontre", catColor: "#0891B2",
    lieu: "Palais des Congrès\nNiamey", date: "28 Mai 2024",
    inscriptions: 610, maxInscriptions: 800, inscPct: 76,
    statut: "En cours", statutColor: "#D97706", statutBg: "#FFFBE8",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT006", titre: "Journée de l'Innovation", categorie: "Innovation", catColor: "#059669",
    lieu: "SANE\nNiamey", date: "12 Juin 2024",
    inscriptions: 220, maxInscriptions: 300, inscPct: 73,
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT007", titre: "Panel : Women in Tech", categorie: "Panel", catColor: "#DB2777",
    lieu: "Centre de Conférences\nNiamey", date: "25 Juin 2024",
    inscriptions: 150, maxInscriptions: 250, inscPct: 60,
    statut: "Planifié", statutColor: "#2563EB", statutBg: "#E0F0FF",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT008", titre: "Formation des Formateurs", categorie: "Formation", catColor: "#D97706",
    lieu: "Université de Niamey\nNiamey", date: "08 Juillet 2024",
    inscriptions: 90, maxInscriptions: 100, inscPct: 90,
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT009", titre: "Sommet de l'Emploi Vert", categorie: "Sommet", catColor: "#10632D",
    lieu: "Palais des Congrès\nNiamey", date: "18 Juillet 2024",
    inscriptions: 240, maxInscriptions: 400, inscPct: 60,
    statut: "En cours", statutColor: "#D97706", statutBg: "#FFFBE8",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=72&fit=crop",
  },
  {
    id: "#EVT010", titre: "Cérémonie de Clôture SANE 2024", categorie: "Cérémonie", catColor: "#E57617",
    lieu: "Palais des Congrès\nNiamey", date: "14 Mai 2024",
    inscriptions: 980, maxInscriptions: 1000, inscPct: 98,
    statut: "Actif", statutColor: "#10632D", statutBg: "#E8F5ED",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=120&h=72&fit=crop",
  },
];

/* ─── Donut chart segments ─── */
const donutSegments = [
  { label: "Salon", value: 3, pct: 25, color: "#10632D" },
  { label: "Conférence", value: 2, pct: 20, color: "#2563EB" },
  { label: "Atelier", value: 2, pct: 15, color: "#7C3AED" },
  { label: "Forum", value: 2, pct: 15, color: "#E57617" },
  { label: "Rencontre", value: 1, pct: 10, color: "#0891B2" },
  { label: "Sommet", value: 1, pct: 8, color: "#059669" },
  { label: "Cérémonie", value: 1, pct: 7, color: "#DB2777" },
];

/* ─── Prochains événements ─── */
const prochainsData = [
  { day: "12", month: "Mai", title: "Salon National de l'Emploi 2024", subtitle: "Palais des Congrès · Niamey\n2,860 inscrits" },
  { day: "22", month: "Mar", title: "Forum sur l'Entrepreneuriat", subtitle: "Centre de Conférences · Niamey\n420 inscrits" },
  { day: "18", month: "Avr", title: "Conférence : Jeunes et Emploi", subtitle: "Université de Niamey\n320 inscrits" },
  { day: "05", month: "Mai", title: "Atelier : Compétences Numériques", subtitle: "Maison des Jeunes · Niamey\n180 inscrits" },
];

/* ─── Top événements ─── */
const topEvenementsData = [
  { rank: 1, title: "Salon National de l'Emploi 2024", subtitle: "2,860 inscrits" },
  { rank: 2, title: "Cérémonie de Clôture", subtitle: "980 inscrits" },
  { rank: 3, title: "Rencontre avec les Recruteurs", subtitle: "610 inscrits" },
  { rank: 4, title: "Forum sur l'Entrepreneuriat", subtitle: "420 inscrits" },
  { rank: 5, title: "Conférence : Jeunes et Emploi", subtitle: "320 inscrits" },
];

export default function EvenementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(evenements, { filterKeys: {"Catégorie":"categorie","Statut":"statut","Lieu":"lieu"} });
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher un événement, une session, un intervenant..."
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
                  <span>Accueil</span><span>&rsaquo;</span><span>Événements</span><span>&rsaquo;</span>
                  <span className="font-semibold text-[var(--sane-green-deep)]">Tous les événements</span>
                </div>
                <h1 className="text-[22px] sm:text-[28px] font-extrabold text-[var(--sane-green-deep)] leading-tight">Gestion des événements</h1>
                <p className="mt-1.5 max-w-[420px] text-[11px] text-[var(--sane-text-light)] leading-relaxed hidden sm:block">
                  Créez, organisez et gérez tous les événements du SANE. Suivez les inscriptions, les sessions, les intervenants et évaluez l&apos;impact de chaque événement.
                </p>
                <button type="button" onClick={tbl.openAdd} className="mt-3 self-start flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow sm:hidden">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  Ajouter un événement
                </button>
              </div>
              <div className="relative h-[110px] sm:h-auto sm:flex-1 sm:min-h-[160px]">
                <Image src="https://images.unsplash.com/photo-1613005341945-35e159e522f1?w=800&h=400&fit=crop&crop=faces&facepad=3" alt="événements" fill className="object-cover object-center" />
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
              Ajouter un événement
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} trendLabel="vs. année dernière" bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_280px]">
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3 min-w-0">
              <FilterBar searchPlaceholder="Rechercher un événement..." filters={["Catégorie", "Statut", "Lieu", "Date"]}  table={tbl} />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Image</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Titre de l&apos;événement <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Catégorie <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Lieu <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Inscriptions <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((e, i) => (
                      <tr key={i} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.selected.includes(e._uid)} onChange={() => tbl.toggle(e._uid)} /></td>
                        <td className="px-2 py-1.5">
                          <div className="relative h-9 w-[72px] overflow-hidden rounded-md border border-[var(--sane-border)]">
                            <Image src={e.img} alt={e.titre} fill className="object-cover object-center" />
                          </div>
                        </td>
                        <td className="px-2 py-2.5 min-w-[220px] max-w-[280px]">
                          <p className="text-[12px] font-semibold text-[var(--sane-green-deep)] leading-snug">{e.titre}</p>
                          <p className="text-[9px] text-[var(--sane-text-light)]">{e.id}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `${e.catColor}18`, color: e.catColor }}>
                            {e.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          {e.lieu.split("\n").map((line, li) => (
                            <p key={li} className={`whitespace-nowrap text-[11px] ${li === 0 ? "text-[var(--sane-green-deep)] font-medium" : "text-[var(--sane-text-light)]"}`}>{line}</p>
                          ))}
                        </td>
                        <td className="px-2 py-2">
                          <p className="whitespace-nowrap text-[11px] text-[var(--sane-green-deep)] font-medium">{e.date}</p>
                        </td>
                        <td className="px-2 py-2">
                          <p className="whitespace-nowrap text-[11px] font-semibold text-[var(--sane-green-deep)]">{e.inscriptions.toLocaleString()} / {e.maxInscriptions.toLocaleString()}</p>
                          <div className="mt-0.5 h-1.5 w-16 overflow-hidden rounded-full bg-[var(--sane-border)]">
                            <div className="h-full rounded-full bg-[var(--sane-green)]" style={{ width: `${e.inscPct}%` }} />
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: e.statutBg, color: e.statutColor }}>
                            {e.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <RowActions table={tbl} row={e} extra="link" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="événements" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:flex 2xl:flex-col gap-3 min-w-0">
              <DonutChart title="Répartition par catégorie" segments={donutSegments} centerValue="12" centerLabel="Événements" />
              <DateBadgeList heading="Prochains événements" items={prochainsData} showViewAll />
              <RankedList heading="Top événements par inscriptions" items={topEvenementsData} showViewAll className="flex-1" />
            </div>
          </div>
        </main>
      </div>

      <TableDialogs table={tbl} entity="événement" />
    </div>
  );
}
