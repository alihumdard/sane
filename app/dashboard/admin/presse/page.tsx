"use client";

import React, { useState } from "react";
import {
  Home, Users, Briefcase, BookOpen, Calendar,
  Newspaper, BarChart3, Settings, Share2, Handshake,
  Eye, Pencil, Trash2, MoreVertical,
} from "lucide-react";

import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatsCard from "@/components/dashboard/StatsCard";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import DonutChart from "@/components/dashboard/DonutChart";
import RankedList from "@/components/dashboard/RankedList";
import DateBadgeList from "@/components/dashboard/DateBadgeList";
import MediaLogo from "@/components/dashboard/MediaLogo";

/* ─── Sidebar ─── */
const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord" },
  { icon: <Users size={18} />, label: "Utilisateurs", chevron: true },
  { icon: <Briefcase size={18} />, label: "Emploi", chevron: true },
  { icon: <BookOpen size={18} />, label: "Formations", chevron: true },
  { icon: <Calendar size={18} />, label: "Événements", chevron: true },
  { icon: <Users size={18} />, label: "Intervenants", chevron: true },
  { icon: <Handshake size={18} />, label: "Partenaires", chevron: true },
  { icon: <Newspaper size={18} />, label: "Contenus", chevron: true },
  {
    icon: <Share2 size={18} />, label: "Presse", active: true, chevron: true, expanded: true,
    subItems: ["Tous les communiqués", "Ajouter un communiqué", "Catégories", "Médias", "Dossiers de presse", "Couvertures médias", "Statistiques"],
    activeSubIndex: 0,
  },
  { icon: <BarChart3 size={18} />, label: "Rapports", chevron: true },
  { icon: <Settings size={18} />, label: "Paramètres", chevron: true },
];

/* ─── Stats ─── */
const statsData = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    value: "28", label: "Total des communiqués", trend: "+27%", trendLabel: "vs. mois dernier", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    value: "46", label: "Couvertures médias", trend: "+18%", trendLabel: "vs. mois dernier", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    value: "152.4K", label: "Vues totales", trend: "+35%", trendLabel: "vs. mois dernier", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    value: "320", label: "Mentions médias", trend: "+22%", trendLabel: "vs. mois dernier", bg: "#F3E8FF", color: "#7C3AED",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    value: "12", label: "Communiqués en vedette", trend: "+33%", trendLabel: "vs. mois dernier", bg: "#FFFBE8", color: "#D97706",
  },
];

/* ─── Table Data ─── */
const communiques = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=80&h=60&fit=crop",
    titre: "Lancement officiel du SANE 2024",
    categorie: "Communiqué", catColor: "#10632D",
    typeMedia: "National", typeColor: "#10632D",
    source: "RTN Niger",
    date: "12 Mars 2024",
    vues: "12,540",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?w=80&h=60&fit=crop",
    titre: "Le SANE au service de l'emploi des jeunes",
    categorie: "Interview", catColor: "#7C3AED",
    typeMedia: "Télévision", typeColor: "#2563EB",
    source: "Télé Sahel",
    date: "10 Mars 2024",
    vues: "8,230",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=80&h=60&fit=crop",
    titre: "Partenariat avec l'AFD pour l'emploi des jeunes",
    categorie: "Partenariat", catColor: "#E57617",
    typeMedia: "Presse écrite", typeColor: "#61756B",
    source: "Le Sahel",
    date: "08 Mars 2024",
    vues: "6,420",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=80&h=60&fit=crop",
    titre: "Focus sur les métiers numériques",
    categorie: "Article", catColor: "#0891B2",
    typeMedia: "En ligne", typeColor: "#0891B2",
    source: "Niger24",
    date: "05 Mars 2024",
    vues: "5,860",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=60&fit=crop",
    titre: "Témoignages : des jeunes transforment leur avenir",
    categorie: "Témoignage", catColor: "#D97706",
    typeMedia: "Radio", typeColor: "#7C3AED",
    source: "Radio Nationale",
    date: "02 Mars 2024",
    vues: "4,920",
    statut: "En vedette", statutColor: "#D97706", statutBg: "#FFFBE8",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&h=60&fit=crop",
    titre: "Conférence de presse : les objectifs du SANE",
    categorie: "Conférence", catColor: "#DB2777",
    typeMedia: "Télévision", typeColor: "#2563EB",
    source: "ORTN",
    date: "28 Fév 2024",
    vues: "7,340",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=80&h=60&fit=crop",
    titre: "L'inclusion au cœur du SANE",
    categorie: "Article", catColor: "#0891B2",
    typeMedia: "Presse écrite", typeColor: "#61756B",
    source: "L'Observateur",
    date: "25 Fév 2024",
    vues: "3,980",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=80&h=60&fit=crop",
    titre: "Signature d'un nouvel accord",
    categorie: "Partenariat", catColor: "#E57617",
    typeMedia: "En ligne", typeColor: "#0891B2",
    source: "ActuNiger",
    date: "22 Fév 2024",
    vues: "5,120",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=80&h=60&fit=crop",
    titre: "Portraits de jeunes talents",
    categorie: "Témoignage", catColor: "#D97706",
    typeMedia: "Radio", typeColor: "#7C3AED",
    source: "Bonferey FM",
    date: "20 Fév 2024",
    vues: "4,410",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=80&h=60&fit=crop",
    titre: "Le SANE dans la presse internationale",
    categorie: "Article", catColor: "#0891B2",
    typeMedia: "International", typeColor: "#003399",
    source: "RFI Afrique",
    date: "18 Fév 2024",
    vues: "6,230",
    statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED",
  },
];

/* ─── Donut segments ─── */
const donutSegments = [
  { label: "Communiqué", value: 7, pct: 25, color: "#10632D" },
  { label: "Article", value: 6, pct: 20, color: "#2563EB" },
  { label: "Interview", value: 5, pct: 18, color: "#7C3AED" },
  { label: "Partenariat", value: 4, pct: 14, color: "#E57617" },
  { label: "Conférence", value: 3, pct: 10, color: "#DB2777" },
  { label: "Témoignage", value: 2, pct: 7, color: "#D97706" },
  { label: "Autres", value: 1, pct: 6, color: "#61756B" },
];

/* ─── Top médias ─── */
const topMediasData = [
  { rank: 1, title: "RTN Niger", subtitle: "12 couvertures" },
  { rank: 2, title: "Télé Sahel", subtitle: "8 couvertures" },
  { rank: 3, title: "Le Sahel", subtitle: "6 couvertures" },
  { rank: 4, title: "Niger24", subtitle: "5 couvertures" },
  { rank: 5, title: "Radio Nationale", subtitle: "4 couvertures" },
];

/* ─── Communiqués récents ─── */
const recentsData = [
  { day: "12", month: "Mar", title: "Lancement officiel du SANE 2024", subtitle: "RTN Niger" },
  { day: "10", month: "Mar", title: "Le SANE au service de l'emploi...", subtitle: "Télé Sahel" },
  { day: "08", month: "Mar", title: "Partenariat avec l'AFD", subtitle: "Le Sahel" },
  { day: "05", month: "Mar", title: "Focus sur les métiers numériques", subtitle: "Niger24" },
  { day: "02", month: "Mar", title: "Témoignages : des jeunes...", subtitle: "Radio Nationale" },
];

export default function PressePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher un communiqué, un média, un mot-clé..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-3">
          {/* Hero Banner - light variant */}
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-white border border-[#DDE8E0]">
            <div className="flex flex-col sm:flex-row">
              <div className="flex flex-col justify-center px-5 sm:px-8 py-5 relative z-10 sm:min-w-[45%]">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[#61756B]">
                  <span>Accueil</span>
                  <span>&rsaquo;</span>
                  <span>Presse</span>
                  <span>&rsaquo;</span>
                  <span className="font-semibold text-[#0a2e16]">Tous les communiqués</span>
                </div>
                <h1 className="text-[28px] font-extrabold text-[#0a2e16] leading-tight">Gestion de la presse</h1>
                <p className="mt-1.5 max-w-[420px] text-[11px] text-[#61756B] leading-relaxed">
                  Publiez et gérez tous les communiqués, articles et couvertures médias du SANE.<br />
                  Suivez la visibilité, les retombées et l&apos;impact médiatique de vos actions.
                </p>
              </div>
              <div className="relative h-[110px] sm:h-auto sm:flex-1 sm:min-h-[160px]">
                <img
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&h=400&fit=crop"
                  alt="presse"
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
                  <p className="text-[18px] italic font-bold text-[#10632D] leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                    Un Niger<br />de Talents
                  </p>
                </div>
              </div>
            </div>
            <button className="absolute right-10 top-5 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-[#E57617] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter un communiqué
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} trendLabel={s.trendLabel} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px]">
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3 min-w-0">
              <FilterBar
                searchPlaceholder="Rechercher un communiqué..."
                filters={["Catégorie", "Type de média", "Statut", "Date de publication"]}
              />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[#DDE8E0] bg-white">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#DDE8E0] bg-[#F5F9F6]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Image</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Titre du communiqué <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Catégorie</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Type de média</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Média / Source <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Vues <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {communiques.map((c) => (
                      <tr key={c.id} className="border-b border-[#DDE8E0] last:border-0 hover:bg-[#F5F9F6]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" /></td>
                        <td className="px-2 py-2">
                          <div className="h-9 w-14 overflow-hidden rounded-md border border-[#DDE8E0]">
                            <img src={c.image} alt={c.titre} className="h-full w-full object-cover" />
                          </div>
                        </td>
                        <td className="px-2 py-2 max-w-[180px]">
                          <p className="text-[11px] font-semibold text-[#0a2e16] leading-tight line-clamp-2">{c.titre}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `${c.catColor}18`, color: c.catColor }}>
                            {c.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `${c.typeColor}18`, color: c.typeColor }}>
                            {c.typeMedia}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1.5">
                            <MediaLogo source={c.source} />
                            <p className="text-[10px] text-[#0a2e16] font-medium whitespace-nowrap">{c.source}</p>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[#0a2e16] font-medium whitespace-nowrap">{c.date}</p>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[#0a2e16] font-semibold whitespace-nowrap">{c.vues}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: c.statutBg, color: c.statutColor }}>
                            {c.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="text-[#2563EB] hover:opacity-80"><Eye size={13} /></button>
                            <button className="text-[#10632D] hover:opacity-80"><Pencil size={13} /></button>
                            <button className="text-[#DC2626] hover:opacity-80"><Trash2 size={13} /></button>
                            <button className="text-[#61756B] hover:opacity-80"><MoreVertical size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination current={1} totalPages={3} totalItems={28} itemLabel="communiqués" />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-3 min-w-0">
              <DonutChart
                title="Répartition par catégorie"
                segments={donutSegments}
                centerValue="28"
                centerLabel="Communiqués"
                showValues={false}
              />
              <RankedList heading="Top médias" items={topMediasData} showViewAll />
              <DateBadgeList heading="Communiqués récents" items={recentsData} showViewAll />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
