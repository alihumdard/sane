"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Share2, Search, Eye, Pencil, Trash2, MoreVertical,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { adminNav } from "@/lib/adminNav";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import { useTable } from "@/components/dashboard/useTable";
import RowActions from "@/components/dashboard/RowActions";
import TableDialogs from "@/components/dashboard/TableDialogs";
import StatsCard from "@/components/dashboard/StatsCard";

/* ─── Sidebar ─── */
const sidebarItems = adminNav("Formations", 0);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3 10.26v-.01L12 5.5l9 4.75-9 5.25zM12 16l-7-3.82v2.85l7 3.82 7-3.82v-2.85L12 16z"/></svg>,
    value: "48", label: "Total des formations", trend: "+12%", bg: "var(--sane-green-tint)", color: "var(--sane-green)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "1,286", label: "Inscriptions", trend: "+18%", bg: "var(--sane-orange-tint)", color: "var(--sane-orange)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8zm0-4h8v2H8z"/></svg>,
    value: "32", label: "Formations actives", trend: "+7%", bg: "var(--sane-blue-tint)", color: "var(--sane-blue)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
    value: "8", label: "À venir cette semaine", trend: "+33%", bg: "var(--sane-purple-tint)", color: "var(--sane-purple)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
    value: "16", label: "Formations terminées", trend: "+5%", bg: "var(--sane-amber-tint)", color: "var(--sane-amber-dark)",
  },
];

/* ─── Table Data ─── */
const formations = [
  {
    id: "#FOR001", titre: "Développement Web pour l'emploi", categorie: "Numérique", catColor: "var(--sane-purple)",
    formateur: "Moussa Diallo", fPhoto: "https://randomuser.me/api/portraits/men/11.jpg",
    mode: "Présentiel", modeColor: "var(--sane-green)",
    dates: "12 - 16 Mars 2024\nNiamey", inscriptions: 45, maxInscriptions: 50, inscPct: 90,
    statut: "Active", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR002", titre: "Gestion de projet digital", categorie: "Gestion", catColor: "var(--sane-orange)",
    formateur: "Fatima Bello", fPhoto: "https://randomuser.me/api/portraits/women/21.jpg",
    mode: "En ligne", modeColor: "var(--sane-blue)",
    dates: "25 - 28 Mars 2024\nNiamey", inscriptions: 38, maxInscriptions: 40, inscPct: 95,
    statut: "Active", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR003", titre: "Compétences numériques", categorie: "Numérique", catColor: "var(--sane-purple)",
    formateur: "Ibrahim Touré", fPhoto: "https://randomuser.me/api/portraits/men/33.jpg",
    mode: "Présentiel", modeColor: "var(--sane-green)",
    dates: "10 - 12 Avril 2024\nNiamey", inscriptions: 28, maxInscriptions: 30, inscPct: 93,
    statut: "Active", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR004", titre: "Leadership et gestion d'équipe", categorie: "Management", catColor: "var(--sane-cyan)",
    formateur: "Aicha Souley", fPhoto: "https://randomuser.me/api/portraits/women/34.jpg",
    mode: "Présentiel", modeColor: "var(--sane-green)",
    dates: "18 - 20 Avril 2024\nNiamey", inscriptions: 32, maxInscriptions: 35, inscPct: 91,
    statut: "En cours", statutColor: "var(--sane-amber-dark)", statutBg: "var(--sane-amber-tint)",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR005", titre: "Entrepreneuriat et création d'entreprise", categorie: "Entrepreneuriat", catColor: "var(--sane-green)",
    formateur: "Omar Issa", fPhoto: "https://randomuser.me/api/portraits/men/55.jpg",
    mode: "En ligne", modeColor: "var(--sane-blue)",
    dates: "05 - 08 Mai 2024\nNiamey", inscriptions: 22, maxInscriptions: 40, inscPct: 55,
    statut: "Active", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR006", titre: "Marketing digital", categorie: "Marketing", catColor: "var(--sane-pink)",
    formateur: "Nadia Saidou", fPhoto: "https://randomuser.me/api/portraits/women/56.jpg",
    mode: "Présentiel", modeColor: "var(--sane-green)",
    dates: "15 - 18 Mai 2024\nNiamey", inscriptions: 30, maxInscriptions: 30, inscPct: 100,
    statut: "Complète", statutColor: "var(--sane-purple)", statutBg: "var(--sane-purple-tint)",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR007", titre: "Préparation à l'emploi", categorie: "Emploi", catColor: "var(--sane-orange)",
    formateur: "Yacoubou Sani", fPhoto: "https://randomuser.me/api/portraits/men/61.jpg",
    mode: "Présentiel", modeColor: "var(--sane-green)",
    dates: "22 - 24 Mai 2024\nNiamey", inscriptions: 26, maxInscriptions: 30, inscPct: 87,
    statut: "Active", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR008", titre: "Techniques de Communication", categorie: "Soft Skills", catColor: "var(--sane-emerald)",
    formateur: "Khadija Ali", fPhoto: "https://randomuser.me/api/portraits/women/62.jpg",
    mode: "En ligne", modeColor: "var(--sane-blue)",
    dates: "01 - 03 Juin 2024\nNiamey", inscriptions: 18, maxInscriptions: 25, inscPct: 72,
    statut: "Active", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    img: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR009", titre: "Analyse de données", categorie: "Numérique", catColor: "var(--sane-purple)",
    formateur: "Ahmed Mahamane", fPhoto: "https://randomuser.me/api/portraits/men/63.jpg",
    mode: "Présentiel", modeColor: "var(--sane-green)",
    dates: "08 - 10 Juin 2024\nNiamey", inscriptions: 24, maxInscriptions: 30, inscPct: 80,
    statut: "En cours", statutColor: "var(--sane-amber-dark)", statutBg: "var(--sane-amber-tint)",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=72&fit=crop",
  },
  {
    id: "#FOR010", titre: "Gestion financière pour PME", categorie: "Finance", catColor: "var(--sane-blue)",
    formateur: "Mariama Amadou", fPhoto: "https://randomuser.me/api/portraits/women/64.jpg",
    mode: "En ligne", modeColor: "var(--sane-blue)",
    dates: "15 - 17 Juin 2024\nNiamey", inscriptions: 14, maxInscriptions: 25, inscPct: 56,
    statut: "Active", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&h=72&fit=crop",
  },
];

/* ─── Donut chart segments ─── */
const categories = [
  { label: "Numérique", pct: 28, color: "var(--sane-green)" },
  { label: "Management", pct: 18, color: "var(--sane-cyan)" },
  { label: "Entrepreneuriat", pct: 15, color: "var(--sane-purple)" },
  { label: "Emploi", pct: 12, color: "var(--sane-orange)" },
  { label: "Marketing", pct: 10, color: "var(--sane-pink)" },
  { label: "Finance", pct: 8, color: "var(--sane-blue)" },
  { label: "Soft Skills", pct: 8, color: "var(--sane-emerald)" },
  { label: "Autres", pct: 1, color: "var(--sane-slate)" },
];

function buildConic(segs: { pct: number; color: string }[]) {
  let acc = 0;
  return segs.map(s => {
    const start = acc;
    acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  }).join(", ");
}

/* ─── Prochaines formations ─── */
const prochaines = [
  { day: "12", month: "Mars", titre: "Développement Web", lieu: "Niamey · Présentiel", inscrits: 45 },
  { day: "18", month: "Avr", titre: "Leadership et gestion d'équipe", lieu: "Niamey · Présentiel", inscrits: 32 },
  { day: "05", month: "Mai", titre: "Entrepreneuriat et création...", lieu: "Niamey · En ligne", inscrits: 22 },
  { day: "22", month: "Mai", titre: "Préparation à l'emploi", lieu: "Niamey · Présentiel", inscrits: 26 },
];

/* ─── Top formations ─── */
const topFormations = [
  { rank: 1, titre: "Développement Web", inscrits: 45 },
  { rank: 2, titre: "Gestion de projet digital", inscrits: 38 },
  { rank: 3, titre: "Leadership et gestion d'équipe", inscrits: 32 },
  { rank: 4, titre: "Marketing digital", inscrits: 30 },
  { rank: 5, titre: "Analyse de données", inscrits: 24 },
];

const rankColors = ["var(--sane-orange)", "var(--sane-green)", "var(--sane-blue)", "var(--sane-pink)", "var(--sane-purple)"];

export default function FormationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(formations, { filterKeys: {"Catégorie":"categorie","Statut":"statut"} });
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher une formation, un formateur, une catégorie..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Breadcrumb */}
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[var(--sane-text-light)]">
            <span>Accueil</span>
            <span className="text-[var(--sane-border)]">›</span>
            <span>Formations</span>
            <span className="text-[var(--sane-border)]">›</span>
            <span className="font-semibold text-[var(--sane-green-deep)]">Toutes les formations</span>
          </div>

          {/* Hero Banner */}
          <div className="relative mb-4 min-h-[110px] sm:h-[160px] overflow-hidden rounded-2xl bg-[var(--sane-green-deep)]">
            <div className="absolute inset-0">
              <Image src="https://randomuser.me/api/portraits/women/68.jpg" alt="formations" fill sizes="100vw" className="object-cover opacity-40" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--sane-green-deep)]/90 via-[var(--sane-green-deep)]/60 to-transparent" />
            <div className="absolute right-32 top-4 opacity-30 hidden sm:block">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="white" opacity="0.2"/>
                <text x="40" y="46" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">SANEM</text>
              </svg>
            </div>
            <div className="absolute right-10 top-5 text-right hidden sm:block">
              <p className="text-[22px] italic font-bold text-white leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Un Niger<br />de Talents
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
              <h1 className="text-[20px] sm:text-[26px] font-extrabold text-white leading-tight">Gestion des formations</h1>
              <p className="mt-1 max-w-[420px] text-[11px] text-white/80 leading-relaxed hidden sm:block">
                Créez, organisez et gérez toutes les formations du SANEM. Suivez les inscriptions, les sessions et évaluez l&apos;impact de chaque formation.
              </p>
              <button type="button" onClick={tbl.openAdd} className="mt-3 self-start flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow sm:hidden">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Ajouter une formation
              </button>
            </div>
            <button type="button" onClick={tbl.openAdd} className="absolute right-10 bottom-6 hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter une formation
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_280px]">
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3 min-w-0">
              <FilterBar searchPlaceholder="Rechercher une formation..." filters={["Catégorie", "Statut"]} table={tbl} />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Image</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Titre de la formation <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Catégorie <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Formateur</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Mode</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Dates <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Inscriptions <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((f, i) => (
                      <tr key={i} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.selected.includes(f._uid)} onChange={() => tbl.toggle(f._uid)} /></td>
                        <td className="px-2 py-1.5">
                          <div className="relative h-9 w-[72px] overflow-hidden rounded-md border border-[var(--sane-border)]">
                            <Image src={f.img} alt={f.titre} fill sizes="100vw" className="object-cover object-center" />
                          </div>
                        </td>
                        <td className="px-2 py-2.5 min-w-[200px] max-w-[260px]">
                          <p className="text-[12px] font-semibold text-[var(--sane-green-deep)] leading-snug">{f.titre}</p>
                          <p className="text-[9px] text-[var(--sane-text-light)]">{f.id}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `color-mix(in srgb, ${f.catColor} 9%, transparent)`, color: f.catColor }}>
                            {f.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className="h-6 w-6 overflow-hidden rounded-full border border-[var(--sane-border)] shrink-0">
                              <Image src={f.fPhoto} alt={f.formateur} width={24} height={24} className="object-cover" />
                            </div>
                            <span className="whitespace-nowrap text-[11px] text-[var(--sane-green-deep)]">{f.formateur}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `color-mix(in srgb, ${f.modeColor} 9%, transparent)`, color: f.modeColor }}>
                            {f.mode}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          {f.dates.split("\n").map((line, li) => (
                            <p key={li} className={`whitespace-nowrap text-[11px] ${li === 0 ? "text-[var(--sane-green-deep)] font-medium" : "text-[var(--sane-text-light)]"}`}>{line}</p>
                          ))}
                        </td>
                        <td className="px-2 py-2">
                          <p className="whitespace-nowrap text-[11px] font-semibold text-[var(--sane-green-deep)]">{f.inscriptions} / {f.maxInscriptions}</p>
                          <div className="mt-0.5 h-1.5 w-16 overflow-hidden rounded-full bg-[var(--sane-border)]">
                            <div className="h-full rounded-full bg-[var(--sane-green)]" style={{ width: `${f.inscPct}%` }} />
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: f.statutBg, color: f.statutColor }}>
                            {f.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <RowActions table={tbl} row={f} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="formations" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:flex 2xl:flex-col gap-3 min-w-0">
              {/* Donut chart */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[var(--sane-orange)]" />
                    <span className="text-[11px] font-bold text-[var(--sane-green-deep)]">Répartition par catégorie</span>
                  </div>
                  <select className="shrink-0 rounded border border-[var(--sane-border)] px-1 py-0.5 text-[9px] text-[var(--sane-text-light)] outline-none">
                    <option>Ce mois</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <div className="h-[85px] w-[85px] rounded-full" style={{ background: `conic-gradient(${buildConic(categories)})` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-[57px] w-[57px] flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-[14px] font-extrabold text-[var(--sane-green-deep)] leading-none">48</span>
                        <span className="text-[7px] text-[var(--sane-text-light)]">Formations</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[3px] flex-1 min-w-0">
                    {categories.map((c, i) => (
                      <div key={i} className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-sm" style={{ backgroundColor: c.color }} />
                          <span className="text-[9px] text-[var(--sane-text-light)] truncate">{c.label}</span>
                        </div>
                        <span className="text-[9px] font-semibold text-[var(--sane-green-deep)] shrink-0 ml-1">{c.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prochaines formations */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[var(--sane-orange)]" />
                    <span className="text-[11px] font-bold text-[var(--sane-green-deep)]">Prochaines formations</span>
                  </div>
                  <button className="shrink-0 ml-1 text-[9px] font-semibold text-[var(--sane-orange)]">Voir tout</button>
                </div>
                <div className="flex flex-col gap-2">
                  {prochaines.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex h-9 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-[var(--sane-orange-light)]">
                        <span className="text-[12px] font-extrabold text-[var(--sane-orange)] leading-none">{p.day}</span>
                        <span className="text-[7px] font-semibold text-[var(--sane-orange)]">{p.month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-[var(--sane-green-deep)] leading-tight truncate">{p.titre}</p>
                        <p className="text-[9px] text-[var(--sane-text-light)] truncate">{p.lieu}</p>
                        <p className="text-[9px] text-[var(--sane-text-light)]">{p.inscrits} inscrits</p>
                      </div>
                      <svg className="shrink-0 mt-1" width="10" height="10" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="var(--sane-text-light)" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top formations populaires */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[var(--sane-orange)]" />
                    <span className="text-[11px] font-bold text-[var(--sane-green-deep)]">Top formations populaires</span>
                  </div>
                  <button className="shrink-0 ml-1 text-[9px] font-semibold text-[var(--sane-orange)]">Voir tout</button>
                </div>
                <div className="flex flex-col gap-2">
                  {topFormations.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: `color-mix(in srgb, ${rankColors[i]} 9%, transparent)`, color: rankColors[i] }}>
                        {t.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-[var(--sane-green-deep)] leading-tight truncate">{t.titre}</p>
                        <p className="text-[9px] text-[var(--sane-text-light)]">{t.inscrits} inscriptions</p>
                      </div>
                      <svg className="shrink-0" width="10" height="10" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="var(--sane-text-light)" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <TableDialogs table={tbl} entity="formation" />
    </div>
  );
}
