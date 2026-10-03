"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Search, ChevronDown, ChevronRight,
  ChevronUp, ChevronLeft, Eye, Download, MoreVertical,
  Plus, RefreshCw, ArrowRight, TrendingUp, Star,
  PenTool, Share2
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { adminNav } from "@/lib/adminNav";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import { useTable } from "@/components/dashboard/useTable";
import RowActions from "@/components/dashboard/RowActions";
import TableDialogs from "@/components/dashboard/TableDialogs";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

/* ─────────────────────────────── ICONS ─────────────────────────────── */

const statIcons = {
  chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>,
  people: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="3.5"/><circle cx="5" cy="9" r="2.5"/><circle cx="19" cy="9" r="2.5"/><path d="M12 12c-3.5 0-6 2-6 4.5V18h12v-1.5c0-2.5-2.5-4.5-6-4.5z"/><path d="M5 13c-2 0-4 1.2-4 3v1h4v-2c0-.7.2-1.4.5-2H5zM19 13c2 0 4 1.2 4 3v1h-4v-2c0-.7-.2-1.4-.5-2H19z"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor"/><path d="M3 10h18" stroke="white" strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="7" y="13" width="3" height="3" rx=".5" fill="white"/><rect x="14" y="13" width="3" height="3" rx=".5" fill="white"/></svg>,
  graduation: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>,
  star: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>,
};

/* ─────────────────────────────── DATA ─────────────────────────────── */

const sidebarItems = adminNav("Rapports", 0);

const statsData = [
  { icon: statIcons.chart, value: "12", label: "Rapports générés", trend: "+33%", bg: "#E0F0FF", color: "#2563EB" },
  { icon: statIcons.people, value: "3.8K", label: "Inscriptions totales", trend: "+22%", bg: "#E8F5ED", color: "#10632D" },
  { icon: statIcons.calendar, value: "48", label: "Événements", trend: "+18%", bg: "#E8F5ED", color: "#10632D" },
  { icon: statIcons.graduation, value: "26", label: "Formations", trend: "+14%", bg: "#F0E8F5", color: "#6B21A8" },
  { icon: statIcons.star, value: "15", label: "Partenaires", trend: "+20%", bg: "#FFF3E8", color: "#E57617" },
];

const lineChartData = [
  { month: "Jan", insc: 30, part: 10 },
  { month: "Fév", insc: 80, part: 20 },
  { month: "Mar", insc: 120, part: 40 },
  { month: "Avr", insc: 100, part: 35 },
  { month: "Mai", insc: 200, part: 60 },
  { month: "Juin", insc: 300, part: 80 },
  { month: "Juil", insc: 400, part: 100 },
  { month: "Août", insc: 500, part: 130 },
  { month: "Sep", insc: 700, part: 200 },
  { month: "Oct", insc: 1000, part: 300 },
  { month: "Nov", insc: 1400, part: 500 },
  { month: "Déc", insc: 1800, part: 700 },
];

const barChartData = [
  { month: "Jan", val: 3 }, { month: "Fév", val: 5 }, { month: "Mar", val: 8 },
  { month: "Avr", val: 12 }, { month: "Mai", val: 15 }, { month: "Juin", val: 20 },
  { month: "Juil", val: 18 }, { month: "Août", val: 25 }, { month: "Sep", val: 30 },
  { month: "Oct", val: 35 }, { month: "Nov", val: 40 }, { month: "Déc", val: 38 },
];

const donutSegments = [
  { label: "Événements", pct: 28, color: "#10632D" },
  { label: "Inscriptions", pct: 22, color: "#1e3a5f" },
  { label: "Emploi", pct: 18, color: "#3b82f6" },
  { label: "Formations", pct: 12, color: "#E57617" },
  { label: "Partenaires", pct: 8, color: "#f59e0b" },
  { label: "Presse", pct: 6, color: "#6B21A8" },
  { label: "Financier", pct: 4, color: "#ec4899" },
  { label: "Autres", pct: 2, color: "#94a3b8" },
];

const catColors: Record<string, string> = {
  "Général": "bg-[#10632D] text-white",
  "Inscriptions": "bg-[#2563EB] text-white",
  "Événements": "bg-[#E57617] text-white",
  "Formations": "bg-[#6B21A8] text-white",
  "Partenaires": "bg-[#f59e0b] text-white",
  "Presse": "bg-[#ec4899] text-white",
  "Financier": "bg-[#1e3a5f] text-white",
  "Utilisateurs": "bg-[#0D7377] text-white",
  "Personnalisée": "bg-[#94a3b8] text-white",
  "Impact": "bg-[#DC2626] text-white",
};

const reportIcons: Record<string, React.ReactNode> = {
  "Général": <BarChart3 size={14} className="text-[#10632D]" />,
  "Inscriptions": <Users size={14} className="text-[#2563EB]" />,
  "Événements": <Calendar size={14} className="text-[#E57617]" />,
  "Formations": <BookOpen size={14} className="text-[#6B21A8]" />,
  "Partenaires": <Star size={14} className="text-[#f59e0b]" />,
  "Presse": <Newspaper size={14} className="text-[#ec4899]" />,
  "Financier": <BarChart3 size={14} className="text-[#1e3a5f]" />,
  "Utilisateurs": <Users size={14} className="text-[#0D7377]" />,
  "Personnalisée": <FileText size={14} className="text-[#94a3b8]" />,
  "Impact": <TrendingUp size={14} className="text-[#DC2626]" />,
};

const reports = [
  { title: "Rapport global du SANE 2024", cat: "Général", period: "Année 2024", format: "PDF", by: "Admin", date: "12 Mars 2024", status: "Terminé" },
  { title: "Statistiques des inscriptions", cat: "Inscriptions", period: "Mars 2024", format: "Excel", by: "Fatima Bello", date: "10 Mars 2024", status: "Terminé" },
  { title: "Participation par événement", cat: "Événements", period: "Fév 2024", format: "PDF", by: "Ibrahim Touré", date: "08 Mars 2024", status: "Terminé" },
  { title: "Rapport des formations", cat: "Formations", period: "Fév 2024", format: "Excel", by: "Aicha Souley", date: "05 Mars 2024", status: "Terminé" },
  { title: "Impact des partenariats", cat: "Partenaires", period: "Jan – Mar 2024", format: "PDF", by: "Omar Issa", date: "02 Mars 2024", status: "En cours" },
  { title: "Couverture médiatique", cat: "Presse", period: "Fév 2024", format: "PDF", by: "Nadia Saidou", date: "28 Fév 2024", status: "Terminé" },
  { title: "Rapport financier", cat: "Financier", period: "Fév 2024", format: "Excel", by: "Ahmed Mahamane", date: "25 Fév 2024", status: "Terminé" },
  { title: "Engagement des utilisateurs", cat: "Utilisateurs", period: "Jan – Fév 2024", format: "PDF", by: "Mariama Amadou", date: "22 Fév 2024", status: "Terminé" },
  { title: "Rapport personnalisé", cat: "Personnalisée", period: "Mars 2024", format: "Excel", by: "Admin", date: "20 Fév 2024", status: "Brouillon" },
  { title: "Rapport d'impact global", cat: "Impact", period: "Année 2023", format: "PDF", by: "Admin", date: "18 Fév 2024", status: "Terminé" },
];

const topReports = [
  { rank: 1, rankColor: "#10632D", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>, bg: "#E8F5ED", color: "#10632D", title: "Rapport global du SANE 2024", downloads: "1,240 téléchargements" },
  { rank: 2, rankColor: "#6B21A8", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6H2z"/><path d="M22 20c0-2.2-1.8-4-4.5-4-.8 0-1.5.1-2.2.4 1.3 1.2 2.2 2.8 2.2 4.6h4.5z"/></svg>, bg: "#FFE8D6", color: "#E57617", title: "Statistiques des inscriptions", downloads: "980 téléchargements" },
  { rank: 3, rankColor: "#0891b2", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18" stroke="white" strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="7" y="13" width="3" height="3" rx=".5" fill="white"/><rect x="14" y="13" width="3" height="3" rx=".5" fill="white"/></svg>, bg: "#E0F0FF", color: "#2563EB", title: "Participation par événement", downloads: "760 téléchargements" },
  { rank: 4, rankColor: "#E57617", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>, bg: "#F0E8F5", color: "#6B21A8", title: "Rapport des formations", downloads: "540 téléchargements" },
  { rank: 5, rankColor: "#ec4899", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, bg: "#FCE7F3", color: "#ec4899", title: "Couverture médiatique", downloads: "420 téléchargements" },
];

const recentReports = [
  { day: "12", month: "Mar", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>, bg: "#E8F5ED", color: "#10632D", title: "Rapport global du SANE 2024", desc: "Général · PDF" },
  { day: "10", month: "Mar", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6H2z"/><path d="M22 20c0-2.2-1.8-4-4.5-4-.8 0-1.5.1-2.2.4 1.3 1.2 2.2 2.8 2.2 4.6h4.5z"/></svg>, bg: "#FFE8D6", color: "#E57617", title: "Statistiques des inscriptions", desc: "Inscriptions · Excel" },
  { day: "08", month: "Mar", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18" stroke="white" strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, bg: "#E0F0FF", color: "#2563EB", title: "Participation par événement", desc: "Événements · PDF" },
  { day: "05", month: "Mar", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>, bg: "#F0E8F5", color: "#6B21A8", title: "Rapport des formations", desc: "Formations · Excel" },
  { day: "02", month: "Mar", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>, bg: "#FFF3E8", color: "#f59e0b", title: "Impact des partenariats", desc: "Partenaires · PDF" },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function AdminRapportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(reports, { filterKeys: { "Catégorie": "cat", "Période": "period", "Format": "format", "Statut": "status" } });
  const maxLine = 1800;
  const maxBar = 40;

  const donutGradient = (() => {
    let acc = 0;
    return donutSegments.map((d) => {
      const start = acc;
      acc += d.pct;
      return `${d.color} ${start * 3.6}deg ${acc * 3.6}deg`;
    }).join(", ");
  })();

  const linePoints = (key: "insc" | "part") => {
    const w = 420, h = 140, px = 35;
    const step = (w - px * 2) / (lineChartData.length - 1);
    return lineChartData.map((d, i) => `${px + i * step},${h - 20 - (d[key] / maxLine) * (h - 40)}`).join(" ");
  };

  return (
    <div className="flex h-screen bg-[#f8faf9] overflow-hidden">
      {/* Mobile overlay */}
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ═══════════ MAIN ═══════════ */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* TOP NAVBAR */}
        <DashboardNavbar searchPlaceholder="Rechercher un rapport..." notificationCount={5} userName="Admin" userRole="Administrateur" onMenuClick={() => setSidebarOpen(true)} />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6">
          {/* ═══════════ WELCOME BANNER ═══════════ */}
          <div className="relative mb-6 overflow-hidden rounded-2xl min-h-[110px] sm:h-[140px]">
            <Image src="/sane_deal.png" alt="Rapports" fill className="object-cover" style={{ objectPosition: "center 30%" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white from-35% via-white/60 via-50% to-transparent" />
            <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#10632D"/><text x="20" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="sans-serif">SANE</text><path d="M8 8 Q20 2 32 8" stroke="#E57617" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
              <p className="text-[16px] italic text-[#E57617] leading-tight font-semibold" style={{ fontFamily: "Georgia, serif" }}>Un Niger<br/>de Talents</p>
            </div>
            <div className="relative z-20 p-4 sm:p-6 flex items-start justify-between">
              <div>
                <nav className="mb-2 flex items-center gap-1.5 text-[11px] text-[#61756B]">
                  <span>Accueil</span><ChevronRight size={11} /><span>Rapports</span><ChevronRight size={11} /><span className="font-medium text-[#0a2e16]">Tous les rapports</span>
                </nav>
                <h1 className="mb-1 text-[18px] sm:text-2xl font-extrabold text-[#0a2e16]">Gestion des rapports</h1>
                <p className="max-w-lg text-[11px] sm:text-[12px] text-[#61756B] hidden sm:block">Consultez et générez tous les rapports du SANE. Suivez les statistiques, les inscriptions, la participation et l&apos;impact de vos événements.</p>
                <button type="button" onClick={tbl.openAdd} className="mt-2 flex items-center gap-1 rounded-lg bg-[#10632D] px-3 py-1.5 text-[10px] font-bold text-white sm:hidden">
                  <Plus size={11} /> Générer
                </button>
              </div>
              <button type="button" onClick={tbl.openAdd} className="hidden sm:flex shrink-0 items-center gap-2 rounded-lg bg-[#10632D] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#0a4a22] mt-4">
                <Plus size={14} /> Générer un rapport
              </button>
            </div>
          </div>

          {/* ═══════════ STATS ROW ═══════════ */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-[#DDE8E0] bg-white px-3 py-3 sm:px-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-xl font-extrabold text-[#0a2e16]">{s.value}</span>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#10632D]">
                      <TrendingUp size={10} /> {s.trend}
                    </span>
                  </div>
                  <p className="text-[9px] text-[#61756B]">vs. mois dernier</p>
                  <p className="text-[10px] text-[#61756B] truncate">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════ CHARTS ═══════════ */}
          <div className="mb-6 flex flex-col gap-4">
              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1.5fr] gap-4">
                {/* Line chart */}
                <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-px w-4 bg-[#E57617]" />
                      <h3 className="text-[12px] font-bold text-[#0a2e16]">Inscriptions et participation</h3>
                    </div>
                    <select className="text-[10px] border border-[#DDE8E0] rounded px-2 py-1 text-[#61756B] outline-none">
                      <option>Cette année</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 mb-2 text-[9px]">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#3b82f6]" /> Inscriptions</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#10632D]" /> Participants</span>
                  </div>
                  <svg viewBox="0 0 420 160" className="w-full">
                    <line x1="35" y1="20" x2="35" y2="140" stroke="#DDE8E0" strokeWidth="0.5" />
                    {[0, 500, 1000, 1500, 2000].map((v, i) => (
                      <text key={i} x="30" y={140 - (v / maxLine) * 100} textAnchor="end" className="text-[7px] fill-[#61756B]">{v.toLocaleString()}</text>
                    ))}
                    {lineChartData.map((d, i) => (
                      <text key={i} x={35 + i * (350 / 11)} y="155" textAnchor="middle" className="text-[7px] fill-[#61756B]">{d.month}</text>
                    ))}
                    <polygon points={`${linePoints("insc")},${35 + 11 * (350 / 11)},140 35,140`} fill="#10632D" opacity="0.08" />
                    <polyline points={linePoints("insc")} fill="none" stroke="#3b82f6" strokeWidth="2" />
                    {lineChartData.map((d, i) => {
                      const x = 35 + i * (350 / 11);
                      const y = 140 - 20 - (d.insc / maxLine) * (140 - 40);
                      return <circle key={`i${i}`} cx={x} cy={y} r="3" fill="#3b82f6" stroke="white" strokeWidth="1.5" />;
                    })}
                    <polyline points={linePoints("part")} fill="none" stroke="#10632D" strokeWidth="2" />
                    {lineChartData.map((d, i) => {
                      const x = 35 + i * (350 / 11);
                      const y = 140 - 20 - (d.part / maxLine) * (140 - 40);
                      return <circle key={`p${i}`} cx={x} cy={y} r="3" fill="#10632D" stroke="white" strokeWidth="1.5" />;
                    })}
                  </svg>
                </div>

                {/* Bar chart */}
                <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-px w-4 bg-[#E57617]" />
                      <h3 className="text-[12px] font-bold text-[#0a2e16]">Rapports par mois</h3>
                    </div>
                    <select className="text-[10px] border border-[#DDE8E0] rounded px-2 py-1 text-[#61756B] outline-none">
                      <option>Cette année</option>
                    </select>
                  </div>
                  <svg viewBox="0 0 360 160" className="w-full">
                    {[0, 10, 20, 30, 40].map((v, i) => (
                      <text key={i} x="20" y={140 - (v / maxBar) * 100} textAnchor="end" className="text-[7px] fill-[#61756B]">{v}</text>
                    ))}
                    {barChartData.map((d, i) => {
                      const x = 30 + i * 27;
                      const h = (d.val / maxBar) * 100;
                      return (
                        <g key={i}>
                          <rect x={x} y={140 - h} width="18" height={h} rx="3" fill={`hsl(${200 + i * 8}, 60%, ${45 + i * 2}%)`} />
                          <text x={x + 9} y="155" textAnchor="middle" className="text-[6px] fill-[#61756B]">{d.month}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Donut chart */}
                <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <h3 className="text-[11px] font-bold text-[#0a2e16]">Répartition des rapports</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-[120px] h-[120px] shrink-0">
                      <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${donutGradient})` }} />
                      <div className="absolute inset-[24px] rounded-full bg-white flex flex-col items-center justify-center">
                        <span className="text-[16px] font-extrabold text-[#0a2e16]">12</span>
                        <span className="text-[7px] text-[#61756B]">Rapports</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-0.5 flex-1">
                      {donutSegments.map((d, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[9px]">
                          <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                          <span className="flex-1 text-[#61756B]">{d.label}</span>
                          <span className="font-semibold text-[#0a2e16]">{d.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════ FILTER + TABLE + RIGHT SIDEBAR ═══════════ */}
              <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_280px] gap-4">
              <div className="flex flex-col gap-4 min-w-0">
              {/* ═══════════ FILTER BAR ═══════════ */}
              <FilterBar searchPlaceholder="Rechercher un rapport..." filters={["Catégorie", "Période", "Format", "Statut"]} table={tbl} />

              {/* ═══════════ TABLE ═══════════ */}
              <div className="overflow-x-auto rounded-xl border border-[#DDE8E0] bg-white">
                <table className="w-full min-w-[950px] text-left">
                  <thead>
                    <tr className="border-b border-[#DDE8E0] bg-[#F5F9F6]">
                      <th className="px-3 py-2 w-8"><input type="checkbox" className="accent-[#10632D]" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[#61756B]">Titre du rapport</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[#61756B]">Catégorie</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[#61756B]">Période</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[#61756B]">Format</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[#61756B]">Généré par</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[#61756B]">Date de création</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[#61756B]">Statut</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[#61756B]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((r) => (
                      <tr key={r._uid} className="border-b border-[#DDE8E0]/50 hover:bg-[#F5F9F6]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="accent-[#10632D]" checked={tbl.selected.includes(r._uid)} onChange={() => tbl.toggle(r._uid)} /></td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#F5F9F6]">
                              {reportIcons[r.cat]}
                            </span>
                            <span className="min-w-[200px] text-[12px] font-semibold text-[#0a2e16]">{r.title}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold ${catColors[r.cat] || "bg-gray-200 text-gray-700"}`}>{r.cat}</span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[#61756B]">{r.period}</td>
                        <td className="px-2 py-2">
                          <span className="flex items-center gap-1 text-[10px] text-[#61756B]">
                            <FileText size={10} /> {r.format}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[#61756B]">{r.by}</td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[#61756B]">{r.date}</td>
                        <td className="px-2 py-2">
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            r.status === "Terminé" ? "bg-[#E8F5ED] text-[#10632D]" :
                            r.status === "En cours" ? "bg-[#FFF3E8] text-[#E57617]" :
                            "bg-[#F3F4F6] text-[#61756B]"
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-2 py-2">
                          <RowActions table={tbl} row={r} extra="download" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="rapports" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>

            </div>
            {/* ═══════════ RIGHT SIDEBAR ═══════════ */}
            <div className="flex flex-col gap-4 min-w-0">
              {/* Top rapports téléchargés */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-[#0a2e16]">Top rapports téléchargés</h3>
                  <Link href="#" className="text-[9px] font-semibold text-[#10632D] hover:text-[#E57617]">Voir tout</Link>
                </div>
                <div className="flex flex-col gap-2.5">
                  {topReports.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold shrink-0" style={{ backgroundColor: `${t.rankColor}18`, color: t.rankColor }}>{t.rank}</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-md shrink-0" style={{ backgroundColor: t.bg, color: t.color }}>{t.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-[#0a2e16] truncate">{t.title}</p>
                        <p className="text-[8px] text-[#61756B]">{t.downloads}</p>
                      </div>
                      <ChevronRight size={12} className="text-[#61756B] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rapports récents */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-[#0a2e16]">Rapports récents</h3>
                  <Link href="#" className="text-[9px] font-semibold text-[#10632D] hover:text-[#E57617]">Voir tout</Link>
                </div>
                <div className="flex flex-col gap-2.5">
                  {recentReports.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-full" style={{ backgroundColor: `${r.color}15` }}>
                        <span className="text-[11px] font-extrabold leading-none" style={{ color: r.color }}>{r.day}</span>
                        <span className="text-[7px] font-semibold" style={{ color: r.color }}>{r.month}</span>
                      </div>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: r.bg, color: r.color }}>{r.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-[#0a2e16] truncate">{r.title}</p>
                        <p className="text-[8px] text-[#61756B]">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
      <TableDialogs table={tbl} entity="rapport" />
    </div>
  );
}
