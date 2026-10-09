"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Bell, ChevronsUpDown, Send } from "lucide-react";

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
    key: "total", label: "Total des notifications", trend: "+24%", bg: "var(--sane-green-tint)", color: "var(--sane-green)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    key: "sent", label: "Envoyées", trend: "+18%", bg: "var(--sane-orange-tint)", color: "var(--sane-orange)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    key: "scheduled", label: "Planifiées", trend: "+33%", bg: "var(--sane-blue-tint)", color: "var(--sane-blue)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
    key: "drafts", label: "Brouillons", trend: "+14%", bg: "var(--sane-purple-tint)", color: "var(--sane-purple)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    key: "openRate", label: "Taux d'ouverture", trend: "+6%", bg: "var(--sane-amber-tint)", color: "var(--sane-amber-dark)",
  },
];

/* ─── Category icon config ─── */
const catConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  "Événement": { color: "var(--sane-green)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--sane-green)"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  "Emploi": { color: "var(--sane-orange)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--sane-orange)"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/></svg> },
  "Formation": { color: "var(--sane-blue)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--sane-blue)"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z"/></svg> },
  "Presse": { color: "var(--sane-purple)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--sane-purple)"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> },
  "Partenariat": { color: "var(--sane-amber-dark)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--sane-amber-dark)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  "Général": { color: "var(--sane-cyan)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--sane-cyan)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> },
  "Système": { color: "var(--sane-red)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--sane-red)"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg> },
};

/* ─── Table Data ─── */
const notifications = [
  {
    titre: "Ouverture des inscriptions SANEM 2024", subtitle: "Les inscriptions sont désormais ouvertes...",
    categorie: "Événement", catColor: "var(--sane-green)", destinataire: "Tous les utilisateurs",
    date: "12 Mars 2024", heure: "10:30", statut: "Envoyée", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    ouvertures: 3240, ouverturesPct: 95,
  },
  {
    titre: "Nouvelles offres d'emploi", subtitle: "15 nouvelles opportunités disponibles",
    categorie: "Emploi", catColor: "var(--sane-orange)", destinataire: "Demandeurs d'emploi",
    date: "10 Mars 2024", heure: "14:15", statut: "Envoyée", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    ouvertures: 2860, ouverturesPct: 88,
  },
  {
    titre: "Nouvelles formations disponibles", subtitle: "Découvrez nos formations certifiantes",
    categorie: "Formation", catColor: "var(--sane-blue)", destinataire: "Tous les utilisateurs",
    date: "08 Mars 2024", heure: "09:20", statut: "Envoyée", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    ouvertures: 2540, ouverturesPct: 92,
  },
  {
    titre: "Rappel : Conférence demain", subtitle: "Ne manquez pas la conférence sur...",
    categorie: "Événement", catColor: "var(--sane-green)", destinataire: "Inscrits à l'événement",
    date: "05 Mars 2024", heure: "16:45", statut: "Envoyée", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    ouvertures: 1980, ouverturesPct: 85,
  },
  {
    titre: "Article de presse publié", subtitle: "Découvrez notre dernière couverture...",
    categorie: "Presse", catColor: "var(--sane-purple)", destinataire: "Tous les utilisateurs",
    date: "02 Mars 2024", heure: "11:10", statut: "Envoyée", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    ouvertures: 1760, ouverturesPct: 90,
  },
  {
    titre: "Nouveau partenaire rejoint", subtitle: "Bienvenue à notre nouveau partenaire...",
    categorie: "Partenariat", catColor: "var(--sane-cyan)", destinataire: "Tous les utilisateurs",
    date: "28 Fév 2024", heure: "13:30", statut: "Envoyée", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    ouvertures: 1420, ouverturesPct: 78,
  },
  {
    titre: "Mise à jour importante", subtitle: "Changements dans le programme...",
    categorie: "Général", catColor: "var(--sane-text-light)", destinataire: "Tous les utilisateurs",
    date: "25 Fév 2024", heure: "10:00", statut: "Planifiée", statutColor: "var(--sane-blue)", statutBg: "var(--sane-blue-tint)",
    ouvertures: 0, ouverturesPct: 0,
  },
  {
    titre: "Invitation spéciale", subtitle: "Rejoignez-nous pour un atelier exclusif...",
    categorie: "Événement", catColor: "var(--sane-green)", destinataire: "Intervenants",
    date: "22 Fév 2024", heure: "15:20", statut: "Envoyée", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    ouvertures: 1380, ouverturesPct: 82,
  },
  {
    titre: "Rappel de session", subtitle: "Votre session commence dans 1 heure...",
    categorie: "Formation", catColor: "var(--sane-blue)", destinataire: "Participants",
    date: "20 Fév 2024", heure: "08:30", statut: "Envoyée", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    ouvertures: 1120, ouverturesPct: 76,
  },
  {
    titre: "Maintenance du système", subtitle: "Le système sera en maintenance...",
    categorie: "Système", catColor: "var(--sane-red)", destinataire: "Tous les utilisateurs",
    date: "18 Fév 2024", heure: "20:00", statut: "Brouillon", statutColor: "var(--sane-text-light)", statutBg: "var(--sane-background)",
    ouvertures: 0, ouverturesPct: 0,
  },
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
  { day: "12", month: "Mar", title: "Ouverture des inscriptions SANEM 2024", subtitle: "Envoyée à tous · 3,240 ouvertures" },
  { day: "10", month: "Mar", title: "Nouvelles offres d'emploi", subtitle: "Envoyée aux demandeurs · 2,860" },
  { day: "08", month: "Mar", title: "Nouvelles formations disponibles", subtitle: "Envoyée à tous · 2,540 ouvertures" },
  { day: "05", month: "Mar", title: "Rappel : Conférence demain", subtitle: "Envoyée aux inscrits · 1,980" },
  { day: "02", month: "Mar", title: "Article de presse publié", subtitle: "Envoyée à tous · 1,760 ouvertures" },
];

const MONTHS = ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

/** "12 Mars 2024" + "10:30" -> sortable number */
function dateValue(n: { date: string; heure: string }) {
  const [d, m, y] = n.date.split(" ");
  const month = MONTHS.findIndex((x) => x.toLowerCase().slice(0, 3) === m.toLowerCase().slice(0, 3) && (m.toLowerCase().startsWith("juil") === (x === "Juil")));
  return Number(y) * 1e8 + (month + 1) * 1e6 + Number(d) * 1e4 + Number(n.heure.replace(":", ""));
}

const columns: { label: string; sortKey?: string; align?: "center" }[] = [
  { label: "Titre de la notification", sortKey: "titre" },
  { label: "Catégorie", sortKey: "categorie" },
  { label: "Type de destinataire" },
  { label: "Date d'envoi", sortKey: "date" },
  { label: "Statut", sortKey: "statut" },
  { label: "Ouvertures", sortKey: "ouvertures" },
  { label: "Actions", align: "center" },
];

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(notifications, {
    filterKeys: { "Catégorie": "categorie", "Statut": "statut", "Type de destinataire": "destinataire" },
    sortGetters: {
      titre: (n) => n.titre,
      categorie: (n) => n.categorie,
      statut: (n) => n.statut,
      ouvertures: (n) => n.ouvertures,
      date: dateValue,
    },
  });

  // live figures: they follow the table (add / delete / send)
  const rows = tbl.rows;
  const sent = rows.filter((n) => n.statut === "Envoyée");
  const statValues: Record<string, string> = {
    total: String(rows.length),
    sent: String(sent.length),
    scheduled: String(rows.filter((n) => n.statut === "Planifiée").length),
    drafts: String(rows.filter((n) => n.statut === "Brouillon").length),
    openRate: `${sent.length ? Math.round(sent.reduce((a, n) => a + n.ouverturesPct, 0) / sent.length) : 0}%`,
  };
  const donutSegments = Object.values(
    rows.reduce<Record<string, { label: string; value: number; pct: number; color: string }>>((acc, n) => {
      acc[n.categorie] ??= { label: n.categorie, value: 0, pct: 0, color: n.catColor };
      acc[n.categorie].value += 1;
      return acc;
    }, {})
  )
    .map((seg) => ({ ...seg, pct: Math.round((seg.value / Math.max(rows.length, 1)) * 100) }))
    .sort((a, b) => b.value - a.value);

  const sendNow = (n: (typeof rows)[number]) => {
    const now = new Date();
    tbl.update(
      n._uid,
      {
        statut: "Envoyée",
        statutColor: "var(--sane-green)",
        statutBg: "var(--sane-green-tint)",
        date: `${String(now.getDate()).padStart(2, "0")} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
        heure: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      },
      "Notification envoyée"
    );
  };
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
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
          <div className="relative mb-4 min-h-[120px] sm:h-[160px] overflow-hidden rounded-2xl bg-[var(--sane-green-deep)]">
            <div className="absolute right-0 top-0 h-full w-full sm:w-[55%]">
              <Image src="/sane_deal.webp" alt="" fill sizes="(max-width: 640px) 100vw, 55vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--sane-green-deep)] via-[var(--sane-green-deep)]/60 to-[var(--sane-green-deep)]/20 sm:via-[var(--sane-green-deep)]/40 sm:to-transparent" />
            </div>
            <div className="absolute right-[110px] top-1/2 -translate-y-1/2 opacity-60 hidden sm:block">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="white" opacity="0.08" />
                <circle cx="50" cy="50" r="45" stroke="var(--sane-orange)" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="6 3" />
                <text x="50" y="48" textAnchor="middle" fill="white" fontSize="18" fontWeight="800">SANEM</text>
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
                Envoyez et gérez toutes les notifications du SANEM. Informez les utilisateurs des mises à jour, événements et opportunités importantes.
              </p>
              <button type="button" onClick={tbl.openAdd} className="mt-3 self-start flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow sm:hidden">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Nouvelle notification
              </button>
            </div>
            <button type="button" onClick={tbl.openAdd} className="absolute right-10 top-5 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nouvelle notification
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={statValues[s.key] ?? "0"} label={s.label} trend={s.trend} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px]">
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3 min-w-0">
              <FilterBar searchPlaceholder="Rechercher une notification..." filters={["Catégorie", "Statut", "Type de destinataire", "Date d'envoi"]}  table={tbl} />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" aria-label="Tout sélectionner" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      {columns.map((c) => {
                        const active = c.sortKey && tbl.sort?.key === c.sortKey;
                        const Icon = !active ? ChevronsUpDown : tbl.sort?.dir === "asc" ? ArrowUp : ArrowDown;
                        return (
                          <th
                            key={c.label}
                            aria-sort={active ? (tbl.sort?.dir === "asc" ? "ascending" : "descending") : undefined}
                            className={`px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--sane-text-light)] ${c.align === "center" ? "text-center" : "text-left"}`}
                          >
                            {c.sortKey ? (
                              <button
                                type="button"
                                onClick={() => tbl.toggleSort(c.sortKey!)}
                                className={`flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-[var(--sane-green)] ${active ? "text-[var(--sane-green)]" : ""}`}
                              >
                                {c.label} <Icon size={10} />
                              </button>
                            ) : (
                              c.label
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((n) => (
                      <tr key={n._uid} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                        <td className="px-3 py-2"><input type="checkbox" aria-label={`Sélectionner ${n.titre}`} className="h-3 w-3 rounded" checked={tbl.selected.includes(n._uid)} onChange={() => tbl.toggle(n._uid)} /></td>
                        <td className="px-2 py-2 max-w-[220px]">
                          <div className="flex items-start gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `color-mix(in srgb, ${(catConfig[n.categorie]?.color || "var(--sane-text-light)")} 8%, transparent)` }}>
                              {catConfig[n.categorie]?.icon || <Bell size={14} className="text-[var(--sane-text-light)]" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-[var(--sane-green-deep)] leading-tight truncate">{n.titre}</p>
                              <p className="text-[9px] text-[var(--sane-text-light)] truncate">{n.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `color-mix(in srgb, ${n.catColor} 9%, transparent)`, color: n.catColor }}>
                            {n.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="text-[10px] text-[var(--sane-green-deep)] font-medium">{n.destinataire}</span>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[var(--sane-green-deep)] font-medium whitespace-nowrap">{n.date}</p>
                          <p className="text-[9px] text-[var(--sane-text-light)]">{n.heure}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: n.statutBg, color: n.statutColor }}>
                            {n.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          {n.ouvertures > 0 ? (
                            <div>
                              <span className="text-[10px] font-semibold text-[var(--sane-green-deep)]">{n.ouvertures.toLocaleString()}</span>
                              <div className="mt-0.5 flex items-center gap-1">
                                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--sane-border)]">
                                  <div className="h-full rounded-full bg-[var(--sane-green)]" style={{ width: `${n.ouverturesPct}%` }} />
                                </div>
                                <span className="text-[8px] text-[var(--sane-text-light)]">{n.ouverturesPct}%</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[var(--sane-text-light)]">-</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <RowActions
                            table={tbl}
                            row={n}
                            extra="duplicate"
                            menuItems={n.statut !== "Envoyée" ? [{ label: "Envoyer maintenant", icon: Send, onClick: () => sendNow(n) }] : []}
                          />
                        </td>
                      </tr>
                    ))}
                    {tbl.pageRows.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-10 text-center text-[12px] text-[var(--sane-text-light)]">
                          Aucune notification trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="notifications" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-3 min-w-0">
              <DonutChart title="Répartition par catégorie" segments={donutSegments} centerValue={String(rows.length)} centerLabel="Notifications" showValues={false} />
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
