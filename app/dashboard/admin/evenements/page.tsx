"use client";

import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Share2, Search, Eye, Pencil, Link2, Trash2, MoreVertical,
} from "lucide-react";

import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatsCard from "@/components/dashboard/StatsCard";

/* ─── Sidebar ─── */
const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord" },
  { icon: <Users size={18} />, label: "Utilisateurs", chevron: true },
  { icon: <Briefcase size={18} />, label: "Emploi", chevron: true },
  { icon: <BookOpen size={18} />, label: "Formations", chevron: true },
  {
    icon: <Calendar size={18} />, label: "Événements", active: true, chevron: true, expanded: true,
    subItems: ["Tous les événements", "Ajouter un événement", "Programme", "Sessions", "Intervenants", "Inscriptions", "Participants", "Lieux", "Catégories"],
    activeSubIndex: 0,
  },
  { icon: <Newspaper size={18} />, label: "Contenus", chevron: true },
  { icon: <Share2 size={18} />, label: "Communication", chevron: true },
  { icon: <BarChart3 size={18} />, label: "Rapports", chevron: true },
  { icon: <Settings size={18} />, label: "Paramètres", chevron: true },
];

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
const categories = [
  { label: "Salon", pct: 25, color: "#10632D" },
  { label: "Conférence", pct: 20, color: "#2563EB" },
  { label: "Atelier", pct: 15, color: "#7C3AED" },
  { label: "Forum", pct: 15, color: "#E57617" },
  { label: "Rencontre", pct: 10, color: "#0891B2" },
  { label: "Sommet", pct: 8, color: "#059669" },
  { label: "Cérémonie", pct: 7, color: "#DB2777" },
];

function buildConic(segs: { pct: number; color: string }[]) {
  let acc = 0;
  return segs.map(s => {
    const start = acc;
    acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  }).join(", ");
}

/* ─── Prochains événements ─── */
const prochains = [
  { day: "12", month: "Mai", titre: "Salon National de l'Emploi 2024", lieu: "Palais des Congrès · Niamey", inscrits: "2,860 inscrits" },
  { day: "22", month: "Mar", titre: "Forum sur l'Entrepreneuriat", lieu: "Centre de Conférences · Niamey", inscrits: "420 inscrits" },
  { day: "18", month: "Avr", titre: "Conférence : Jeunes et Emploi", lieu: "Université de Niamey", inscrits: "320 inscrits" },
  { day: "05", month: "Mai", titre: "Atelier : Compétences Numériques", lieu: "Maison des Jeunes · Niamey", inscrits: "180 inscrits" },
];

/* ─── Top événements ─── */
const topEvenements = [
  { rank: 1, titre: "Salon National de l'Emploi 2024", inscrits: "2,860 inscrits" },
  { rank: 2, titre: "Cérémonie de Clôture", inscrits: "980 inscrits" },
  { rank: 3, titre: "Rencontre avec les Recruteurs", inscrits: "610 inscrits" },
  { rank: 4, titre: "Forum sur l'Entrepreneuriat", inscrits: "420 inscrits" },
  { rank: 5, titre: "Conférence : Jeunes et Emploi", inscrits: "320 inscrits" },
];

const rankColors = ["#E57617", "#10632D", "#2563EB", "#DB2777", "#7C3AED"];

export default function EvenementsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          searchPlaceholder="Rechercher un événement, une session, un intervenant..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Hero Banner - light variant with breadcrumb inside */}
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-white border border-[#DDE8E0]">
            <div className="flex">
              <div className="flex flex-col justify-center px-8 py-5 relative z-10" style={{ minWidth: "45%" }}>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[#61756B]">
                  <span>Accueil</span>
                  <span>&rsaquo;</span>
                  <span>Événements</span>
                  <span>&rsaquo;</span>
                  <span className="font-semibold text-[#0a2e16]">Tous les événements</span>
                </div>
                <h1 className="text-[28px] font-extrabold text-[#0a2e16] leading-tight">Gestion des événements</h1>
                <p className="mt-1.5 max-w-[420px] text-[11px] text-[#61756B] leading-relaxed">
                  Créez, organisez et gérez tous les événements du SANE. Suivez les inscriptions,<br />
                  les sessions, les intervenants et évaluez l&apos;impact de chaque événement.
                </p>
              </div>
              <div className="relative flex-1 min-h-[160px]">
                <Image src="https://images.unsplash.com/photo-1613005341945-35e159e522f1?w=800&h=400&fit=crop&crop=faces&facepad=3" alt="événements" fill className="object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
                <div className="absolute right-[110px] top-1/2 -translate-y-1/2 opacity-60">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="#10632D" opacity="0.08" />
                    <circle cx="50" cy="50" r="45" stroke="#E57617" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="6 3" />
                    <text x="50" y="48" textAnchor="middle" fill="#10632D" fontSize="18" fontWeight="800">SANE</text>
                    <text x="50" y="60" textAnchor="middle" fill="#10632D" fontSize="5" fontWeight="600" letterSpacing="0.5">SALON NATIONAL DE L&apos;EMPLOI</text>
                  </svg>
                </div>
                <div className="absolute right-5 bottom-3 text-right">
                  <p className="text-[18px] italic font-bold text-[#10632D] leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                    Un Niger<br />de Talents
                  </p>
                </div>
              </div>
            </div>
            <button className="absolute right-10 top-5 z-10 flex items-center gap-1.5 rounded-lg bg-[#E57617] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter un événement
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} trendLabel="vs. année dernière" bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 overflow-hidden" style={{ gridTemplateColumns: "minmax(0,1fr) 260px" }}>
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3">
              {/* Filter bar */}
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DDE8E0] bg-white p-3">
                <div className="flex w-[180px] items-center gap-1.5 rounded-lg border border-[#DDE8E0] bg-[#F5F9F6] px-2.5 py-1.5">
                  <Search size={13} className="shrink-0 text-[#61756B]" />
                  <input type="text" placeholder="Rechercher un événement..." className="w-full bg-transparent text-[11px] text-[#0a2e16] placeholder:text-[#61756B]/60 outline-none" />
                </div>
                {["Catégorie", "Statut", "Lieu", "Date"].map(f => (
                  <select key={f} className="rounded-lg border border-[#DDE8E0] bg-white px-2 py-1.5 text-[11px] text-[#0a2e16] outline-none">
                    <option>{f}</option>
                  </select>
                ))}
                <button className="shrink-0 rounded-lg bg-[#10632D] px-4 py-1.5 text-[11px] font-semibold text-white">Rechercher</button>
                <button className="shrink-0 rounded-lg border border-[#DDE8E0] bg-white px-3 py-1.5 text-[11px] text-[#61756B]">Réinitialiser</button>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-[#DDE8E0] bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#DDE8E0] bg-[#F5F9F6]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Image</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Titre de l&apos;événement <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Catégorie <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Lieu <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Inscriptions <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evenements.map((e, i) => (
                      <tr key={i} className="border-b border-[#DDE8E0] last:border-0 hover:bg-[#F5F9F6]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" /></td>
                        <td className="px-2 py-1.5">
                          <div className="relative h-9 w-[72px] overflow-hidden rounded-md border border-[#DDE8E0]">
                            <Image src={e.img} alt={e.titre} fill className="object-cover object-center" />
                          </div>
                        </td>
                        <td className="px-2 py-2 max-w-[160px]">
                          <p className="text-[11px] font-semibold text-[#0a2e16] leading-tight">{e.titre}</p>
                          <p className="text-[9px] text-[#61756B]">{e.id}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${e.catColor}18`, color: e.catColor }}>
                            {e.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          {e.lieu.split("\n").map((line, li) => (
                            <p key={li} className={`text-[10px] ${li === 0 ? "text-[#0a2e16] font-medium" : "text-[#61756B]"}`}>{line}</p>
                          ))}
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[#0a2e16] font-medium">{e.date}</p>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] font-semibold text-[#0a2e16]">{e.inscriptions.toLocaleString()} / {e.maxInscriptions.toLocaleString()}</p>
                          <div className="mt-0.5 h-1.5 w-16 overflow-hidden rounded-full bg-[#DDE8E0]">
                            <div className="h-full rounded-full bg-[#10632D]" style={{ width: `${e.inscPct}%` }} />
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: e.statutBg, color: e.statutColor }}>
                            {e.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="text-[#2563EB] hover:opacity-80"><Eye size={13} /></button>
                            <button className="text-[#10632D] hover:opacity-80"><Pencil size={13} /></button>
                            <button className="text-[#61756B] hover:opacity-80"><Link2 size={13} /></button>
                            <button className="text-[#DC2626] hover:opacity-80"><Trash2 size={13} /></button>
                            <button className="text-[#61756B] hover:opacity-80"><MoreVertical size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-[#DDE8E0] px-4 py-2.5">
                  <span className="text-[10px] text-[#61756B]">Affichage de 1 à 10 sur 12 événements</span>
                  <div className="flex items-center gap-2">
                    <select className="rounded border border-[#DDE8E0] px-1.5 py-0.5 text-[10px] text-[#0a2e16] outline-none">
                      <option>10 par page</option>
                    </select>
                    <div className="flex items-center gap-1">
                      <button className="rounded px-1.5 py-0.5 text-[10px] text-[#61756B]">&lsaquo;</button>
                      {[1, 2].map(p => (
                        <button key={p} className={`h-6 w-6 rounded text-[10px] font-semibold ${p === 1 ? "bg-[#10632D] text-white" : "text-[#61756B] hover:bg-[#F5F9F6]"}`}>{p}</button>
                      ))}
                      <span className="text-[10px] text-[#61756B]">...</span>
                      <button className="rounded px-1.5 py-0.5 text-[10px] text-[#61756B]">&rsaquo;</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-3 overflow-hidden w-full">
              {/* Donut chart - Répartition par catégorie */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#E57617]" />
                    <span className="text-[11px] font-bold text-[#0a2e16]">Répartition par catégorie</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <div className="h-[85px] w-[85px] rounded-full" style={{ background: `conic-gradient(${buildConic(categories)})` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-[57px] w-[57px] flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-[14px] font-extrabold text-[#0a2e16] leading-none">12</span>
                        <span className="text-[7px] text-[#61756B]">Événements</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[3px] flex-1 min-w-0">
                    {categories.map((c, i) => (
                      <div key={i} className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-sm" style={{ backgroundColor: c.color }} />
                          <span className="text-[9px] text-[#61756B] truncate">{c.label}</span>
                        </div>
                        <span className="text-[9px] font-semibold text-[#0a2e16] shrink-0 ml-1">{c.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prochains événements */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#E57617]" />
                    <span className="text-[11px] font-bold text-[#0a2e16]">Prochains événements</span>
                  </div>
                  <button className="shrink-0 ml-1 text-[9px] font-semibold text-[#E57617]">Voir tout</button>
                </div>
                <div className="flex flex-col gap-2">
                  {prochains.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex h-9 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-[#FFF3E8]">
                        <span className="text-[12px] font-extrabold text-[#E57617] leading-none">{p.day}</span>
                        <span className="text-[7px] font-semibold text-[#E57617]">{p.month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight truncate">{p.titre}</p>
                        <p className="text-[9px] text-[#61756B] truncate">{p.lieu}</p>
                        <p className="text-[9px] text-[#61756B]">{p.inscrits}</p>
                      </div>
                      <svg className="shrink-0 mt-1" width="10" height="10" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="#61756B" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top événements par inscriptions */}
              <div className="flex-1 rounded-xl border border-[#DDE8E0] bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#E57617]" />
                    <span className="text-[11px] font-bold text-[#0a2e16]">Top événements par inscriptions</span>
                  </div>
                  <button className="shrink-0 ml-1 text-[9px] font-semibold text-[#E57617]">Voir tout</button>
                </div>
                <div className="flex flex-col gap-2">
                  {topEvenements.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: `${rankColors[i]}18`, color: rankColors[i] }}>
                        {t.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight truncate">{t.titre}</p>
                        <p className="text-[9px] text-[#61756B]">{t.inscrits}</p>
                      </div>
                      <svg className="shrink-0" width="10" height="10" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="#61756B" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}
