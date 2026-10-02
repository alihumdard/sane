"use client";

import React from "react";
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

/* ─── Sidebar ─── */
const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord" },
  { icon: <Users size={18} />, label: "Utilisateurs", chevron: true },
  { icon: <Briefcase size={18} />, label: "Emploi", chevron: true },
  { icon: <BookOpen size={18} />, label: "Formations", chevron: true },
  { icon: <Calendar size={18} />, label: "Événements", chevron: true },
  { icon: <Users size={18} />, label: "Intervenants", chevron: true },
  {
    icon: <Handshake size={18} />, label: "Partenaires", active: true, chevron: true, expanded: true,
    subItems: ["Tous les partenaires", "Ajouter un partenaire", "Catégories", "Types de partenariat", "Conventions", "Documents", "Statistiques"],
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

/* ─── Logo SVG per partner ─── */
function PartnerLogo({ nom }: { nom: string }) {
  const logos: Record<string, React.ReactNode> = {
    "UNICEF": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00AEEF]">
        <span className="text-[7px] font-extrabold text-white leading-none">unicef</span>
      </div>
    ),
    "Banque Mondiale": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2563EB]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.5"/><path d="M3 12h18M12 3c-3 3-4 6-4 9s1 6 4 9M12 3c3 3 4 6 4 9s-1 6-4 9" stroke="#2563EB" strokeWidth="1.2" fill="none"/></svg>
      </div>
    ),
    "AFD": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC2626]">
        <span className="text-[9px] font-extrabold text-white">AFD</span>
      </div>
    ),
    "GIZ": (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F5ED]">
        <span className="text-[11px] font-extrabold italic text-[#10632D]">giz</span>
      </div>
    ),
    "PNUD": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2563EB]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.5"/><path d="M8 8c0 0 1-2 4-2s4 2 4 2" stroke="#2563EB" strokeWidth="1" fill="none"/><path d="M6 14c1-3 3-5 6-5s5 2 6 5" stroke="#2563EB" strokeWidth="1" fill="none"/></svg>
      </div>
    ),
    "Enabel": (
      <div className="flex h-9 w-14 items-center justify-center rounded-lg border border-[#DDE8E0] bg-white">
        <span className="text-[8px] font-bold text-[#E57617]">Enabel</span>
      </div>
    ),
    "Union Européenne": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003399]">
        <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill="#003399"/>
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
            const a = (i * 30 - 90) * Math.PI / 180;
            return <text key={i} x={9 + 5.5 * Math.cos(a)} y={9 + 5.5 * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fill="#FFCC00" fontSize="3">★</text>;
          })}
        </svg>
      </div>
    ),
    "OIT": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0891B2] bg-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#0891B2" strokeWidth="1.5"/><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#0891B2" strokeWidth="1.2" fill="none"/><line x1="7" y1="15" x2="17" y2="15" stroke="#0891B2" strokeWidth="1.2"/></svg>
      </div>
    ),
    "BAD (Banque Africaine)": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#059669]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="5" stroke="white" strokeWidth="1.5" fill="none"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.5" fill="none"/></svg>
      </div>
    ),
    "TotalEnergies": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC2626]">
        <span className="text-[7px] font-extrabold text-white leading-none">Total<br/>E</span>
      </div>
    ),
  };
  return <>{logos[nom] || <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F9F6] border border-[#DDE8E0]"><span className="text-[8px] font-bold text-[#61756B]">{nom.substring(0,3)}</span></div>}</>;
}

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
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          searchPlaceholder="Rechercher un partenaire, une entreprise, un secteur..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Hero Banner - light variant */}
          <div className="relative mb-4 overflow-hidden rounded-2xl bg-white border border-[#DDE8E0]">
            <div className="flex">
              <div className="flex flex-col justify-center px-8 py-5 relative z-10" style={{ minWidth: "45%" }}>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[#61756B]">
                  <span>Accueil</span>
                  <span>&rsaquo;</span>
                  <span>Partenaires</span>
                  <span>&rsaquo;</span>
                  <span className="font-semibold text-[#0a2e16]">Tous les partenaires</span>
                </div>
                <h1 className="text-[28px] font-extrabold text-[#0a2e16] leading-tight">Gestion des partenaires</h1>
                <p className="mt-1.5 max-w-[420px] text-[11px] text-[#61756B] leading-relaxed">
                  Gérez tous les partenaires du SANE. Ajoutez de nouveaux partenaires,<br />
                  organisez-les par catégorie et suivez leurs contributions.
                </p>
              </div>
              <div className="relative flex-1 min-h-[160px]">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop"
                  alt="partenaires"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
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
              Ajouter un partenaire
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} trendLabel={s.trendLabel} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 overflow-hidden" style={{ gridTemplateColumns: "minmax(0,1fr) 260px" }}>
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3">
              <FilterBar searchPlaceholder="Rechercher un partenaire..." filters={["Catégorie", "Type de partenariat", "Pays", "Statut"]} />

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-[#DDE8E0] bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#DDE8E0] bg-[#F5F9F6]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Logo</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Nom du partenaire <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Catégorie</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Pays <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Type de partenariat <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date d&apos;ajout <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partenaires.map((p) => (
                      <tr key={p.id} className="border-b border-[#DDE8E0] last:border-0 hover:bg-[#F5F9F6]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" /></td>
                        <td className="px-2 py-2">
                          <PartnerLogo nom={p.nom} />
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[11px] font-semibold text-[#0a2e16]">{p.nom}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${p.catColor}18`, color: p.catColor }}>
                            {p.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[13px]">{p.flag}</span>
                            <p className="text-[10px] text-[#0a2e16] font-medium whitespace-nowrap">{p.pays}</p>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${p.typeColor}18`, color: p.typeColor }}>
                            {p.type}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: p.statutBg, color: p.statutColor }}>
                            {p.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[#0a2e16] font-medium whitespace-nowrap">{p.date}</p>
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

                <Pagination current={1} totalPages={4} totalItems={36} itemLabel="partenaires" />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-3 overflow-hidden w-full">
              <DonutChart title="Répartition par catégorie" segments={donutSegments} centerValue="36" centerLabel="Partenaires" showValues={false} />
              <RankedList heading="Top partenaires actifs" items={topPartenairesData} showViewAll />
              <DateBadgeList heading="Prochains renouvellements" items={renouvellements} showViewAll />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
