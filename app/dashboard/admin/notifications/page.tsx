"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar,
  Newspaper, BarChart3, Settings, Share2, Bell,
  Eye, Pencil, Copy, Trash2, MoreVertical,
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
const sidebarItems = adminNav("Notifications", 0);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    value: "126", label: "Total des notifications", trend: "+24%", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    value: "98", label: "Envoyées", trend: "+18%", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    value: "12", label: "Planifiées", trend: "+33%", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
    value: "8", label: "Brouillons", trend: "+14%", bg: "#F3E8FF", color: "#7C3AED",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    value: "92%", label: "Taux d'ouverture", trend: "+6%", bg: "#FFFBE8", color: "#D97706",
  },
];

/* ─── Category icon config ─── */
const catConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  "Événement": { color: "#10632D", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#10632D"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  "Emploi": { color: "#E57617", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#E57617"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/></svg> },
  "Formation": { color: "#2563EB", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563EB"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z"/></svg> },
  "Presse": { color: "#7C3AED", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#7C3AED"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> },
  "Partenariat": { color: "#D97706", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  "Général": { color: "#0891B2", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#0891B2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> },
  "Système": { color: "#DC2626", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#DC2626"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg> },
};

/* ─── Table Data ─── */
const notifications = [
  {
    titre: "Ouverture des inscriptions SANE 2024", subtitle: "Les inscriptions sont désormais ouvertes...",
    categorie: "Événement", catColor: "#10632D", destinataire: "Tous les utilisateurs",
    date: "12 Mars 2024", heure: "10:30", statut: "Envoyée", statutColor: "#10632D", statutBg: "#E8F5ED",
    ouvertures: 3240, ouverturesPct: 95,
  },
  {
    titre: "Nouvelles offres d'emploi", subtitle: "15 nouvelles opportunités disponibles",
    categorie: "Emploi", catColor: "#E57617", destinataire: "Demandeurs d'emploi",
    date: "10 Mars 2024", heure: "14:15", statut: "Envoyée", statutColor: "#10632D", statutBg: "#E8F5ED",
    ouvertures: 2860, ouverturesPct: 88,
  },
  {
    titre: "Nouvelles formations disponibles", subtitle: "Découvrez nos formations certifiantes",
    categorie: "Formation", catColor: "#2563EB", destinataire: "Tous les utilisateurs",
    date: "08 Mars 2024", heure: "09:20", statut: "Envoyée", statutColor: "#10632D", statutBg: "#E8F5ED",
    ouvertures: 2540, ouverturesPct: 92,
  },
  {
    titre: "Rappel : Conférence demain", subtitle: "Ne manquez pas la conférence sur...",
    categorie: "Événement", catColor: "#10632D", destinataire: "Inscrits à l'événement",
    date: "05 Mars 2024", heure: "16:45", statut: "Envoyée", statutColor: "#10632D", statutBg: "#E8F5ED",
    ouvertures: 1980, ouverturesPct: 85,
  },
  {
    titre: "Article de presse publié", subtitle: "Découvrez notre dernière couverture...",
    categorie: "Presse", catColor: "#7C3AED", destinataire: "Tous les utilisateurs",
    date: "02 Mars 2024", heure: "11:10", statut: "Envoyée", statutColor: "#10632D", statutBg: "#E8F5ED",
    ouvertures: 1760, ouverturesPct: 90,
  },
  {
    titre: "Nouveau partenaire rejoint", subtitle: "Bienvenue à notre nouveau partenaire...",
    categorie: "Partenariat", catColor: "#0891B2", destinataire: "Tous les utilisateurs",
    date: "28 Fév 2024", heure: "13:30", statut: "Envoyée", statutColor: "#10632D", statutBg: "#E8F5ED",
    ouvertures: 1420, ouverturesPct: 78,
  },
  {
    titre: "Mise à jour importante", subtitle: "Changements dans le programme...",
    categorie: "Général", catColor: "#61756B", destinataire: "Tous les utilisateurs",
    date: "25 Fév 2024", heure: "10:00", statut: "Planifiée", statutColor: "#2563EB", statutBg: "#E0F0FF",
    ouvertures: 0, ouverturesPct: 0,
  },
  {
    titre: "Invitation spéciale", subtitle: "Rejoignez-nous pour un atelier exclusif...",
    categorie: "Événement", catColor: "#10632D", destinataire: "Intervenants",
    date: "22 Fév 2024", heure: "15:20", statut: "Envoyée", statutColor: "#10632D", statutBg: "#E8F5ED",
    ouvertures: 1380, ouverturesPct: 82,
  },
  {
    titre: "Rappel de session", subtitle: "Votre session commence dans 1 heure...",
    categorie: "Formation", catColor: "#2563EB", destinataire: "Participants",
    date: "20 Fév 2024", heure: "08:30", statut: "Envoyée", statutColor: "#10632D", statutBg: "#E8F5ED",
    ouvertures: 1120, ouverturesPct: 76,
  },
  {
    titre: "Maintenance du système", subtitle: "Le système sera en maintenance...",
    categorie: "Système", catColor: "#DC2626", destinataire: "Tous les utilisateurs",
    date: "18 Fév 2024", heure: "20:00", statut: "Brouillon", statutColor: "#61756B", statutBg: "#F5F9F6",
    ouvertures: 0, ouverturesPct: 0,
  },
];

/* ─── Donut chart segments ─── */
const donutSegments = [
  { label: "Événement", value: 35, pct: 28, color: "#10632D" },
  { label: "Emploi", value: 25, pct: 20, color: "#E57617" },
  { label: "Formation", value: 19, pct: 15, color: "#2563EB" },
  { label: "Presse", value: 15, pct: 12, color: "#7C3AED" },
  { label: "Partenariat", value: 13, pct: 10, color: "#0891B2" },
  { label: "Général", value: 10, pct: 8, color: "#61756B" },
  { label: "Système", value: 6, pct: 5, color: "#DC2626" },
  { label: "Autres", value: 3, pct: 2, color: "#D97706" },
];

/* ─── Top notifications ─── */
const topNotificationsData = [
  { rank: 1, title: "Ouverture des inscriptions", subtitle: "3,240 ouvertures (95%)" },
  { rank: 2, title: "Nouvelles offres d'emploi", subtitle: "2,860 ouvertures (88%)" },
  { rank: 3, title: "Nouvelles formations", subtitle: "2,540 ouvertures (92%)" },
  { rank: 4, title: "Rappel : Conférence demain", subtitle: "1,980 ouvertures (85%)" },
  { rank: 5, title: "Article de presse publié", subtitle: "1,760 ouvertures (90%)" },
];

/* ─── Notifications récentes ─── */
const recentesData = [
  { day: "12", month: "Mar", title: "Ouverture des inscriptions SANE 2024", subtitle: "Envoyée à tous · 3,240 ouvertures" },
  { day: "10", month: "Mar", title: "Nouvelles offres d'emploi", subtitle: "Envoyée aux demandeurs · 2,860" },
  { day: "08", month: "Mar", title: "Nouvelles formations disponibles", subtitle: "Envoyée à tous · 2,540 ouvertures" },
  { day: "05", month: "Mar", title: "Rappel : Conférence demain", subtitle: "Envoyée aux inscrits · 1,980" },
  { day: "02", month: "Mar", title: "Article de presse publié", subtitle: "Envoyée à tous · 1,760 ouvertures" },
];

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(notifications, { filterKeys: {"Catégorie":"categorie","Statut":"statut","Type de destinataire":"destinataire"} });
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher une notification, un utilisateur, une catégorie..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Hero Banner - dark variant */}
          <div className="relative mb-4 min-h-[120px] sm:h-[160px] overflow-hidden rounded-2xl bg-[#0a2e16]">
            <div className="absolute right-0 top-0 h-full w-full sm:w-[55%]">
              <Image src="https://images.unsplash.com/photo-1611432579699-484f7990b127?w=800&h=400&fit=crop" alt="notifications" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e16] via-[#0a2e16]/60 to-[#0a2e16]/20 sm:via-[#0a2e16]/40 sm:to-transparent" />
            </div>
            <div className="absolute right-[110px] top-1/2 -translate-y-1/2 opacity-60 hidden sm:block">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="white" opacity="0.08" />
                <circle cx="50" cy="50" r="45" stroke="#E57617" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="6 3" />
                <text x="50" y="48" textAnchor="middle" fill="white" fontSize="18" fontWeight="800">SANE</text>
                <text x="50" y="60" textAnchor="middle" fill="white" fontSize="5" fontWeight="600" letterSpacing="0.5">SALON NATIONAL DE L&apos;EMPLOI</text>
              </svg>
            </div>
            <div className="absolute right-5 bottom-3 text-right hidden sm:block">
              <p className="text-[18px] italic font-bold text-white leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Un Niger<br />de Talents
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-white/70">
                <span>Accueil</span><span>&rsaquo;</span><span>Notifications</span><span>&rsaquo;</span>
                <span className="font-semibold text-white">Toutes les notifications</span>
              </div>
              <h1 className="text-[20px] sm:text-[26px] font-extrabold text-white leading-tight">Gestion des notifications</h1>
              <p className="mt-1 max-w-[420px] text-[11px] text-white/80 leading-relaxed hidden sm:block">
                Envoyez et gérez toutes les notifications du SANE. Informez les utilisateurs des mises à jour, événements et opportunités importantes.
              </p>
              <button type="button" onClick={tbl.openAdd} className="mt-3 self-start flex items-center gap-1.5 rounded-lg bg-[#E57617] px-4 py-2 text-[12px] font-bold text-white shadow sm:hidden">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Nouvelle notification
              </button>
            </div>
            <button type="button" onClick={tbl.openAdd} className="absolute right-10 top-5 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-[#E57617] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nouvelle notification
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px]">
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3 min-w-0">
              <FilterBar searchPlaceholder="Rechercher une notification..." filters={["Catégorie", "Statut", "Type de destinataire", "Date d'envoi"]}  table={tbl} />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[#DDE8E0] bg-white">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-[#DDE8E0] bg-[#F5F9F6]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Titre de la notification <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Catégorie <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Type de destinataire</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date d&apos;envoi <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Ouvertures</th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((n, i) => (
                      <tr key={i} className="border-b border-[#DDE8E0] last:border-0 hover:bg-[#F5F9F6]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.selected.includes(n._uid)} onChange={() => tbl.toggle(n._uid)} /></td>
                        <td className="px-2 py-2 max-w-[220px]">
                          <div className="flex items-start gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${(catConfig[n.categorie]?.color || "#61756B")}15` }}>
                              {catConfig[n.categorie]?.icon || <Bell size={14} className="text-[#61756B]" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-[#0a2e16] leading-tight truncate">{n.titre}</p>
                              <p className="text-[9px] text-[#61756B] truncate">{n.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${n.catColor}18`, color: n.catColor }}>
                            {n.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="text-[10px] text-[#0a2e16] font-medium">{n.destinataire}</span>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[#0a2e16] font-medium whitespace-nowrap">{n.date}</p>
                          <p className="text-[9px] text-[#61756B]">{n.heure}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: n.statutBg, color: n.statutColor }}>
                            {n.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          {n.ouvertures > 0 ? (
                            <div>
                              <span className="text-[10px] font-semibold text-[#0a2e16]">{n.ouvertures.toLocaleString()}</span>
                              <div className="mt-0.5 flex items-center gap-1">
                                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#DDE8E0]">
                                  <div className="h-full rounded-full bg-[#10632D]" style={{ width: `${n.ouverturesPct}%` }} />
                                </div>
                                <span className="text-[8px] text-[#61756B]">{n.ouverturesPct}%</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#61756B]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <RowActions table={tbl} row={n} extra="duplicate" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="notifications" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-3 min-w-0">
              <DonutChart title="Répartition par catégorie" segments={donutSegments} centerValue="126" centerLabel="Notifications" showValues={false} />
              <RankedList heading="Top notifications (ouvertures)" items={topNotificationsData} showViewAll />
              <DateBadgeList heading="Notifications récentes" items={recentesData} showViewAll />
            </div>
          </div>
        </main>
      </div>
      <TableDialogs table={tbl} entity="notification" />
    </div>
  );
}
