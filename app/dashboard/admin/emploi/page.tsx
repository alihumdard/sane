"use client";

import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar,
  Newspaper, BarChart3, Settings, Share2,
  Eye, Pencil, Copy, Trash2, MoreVertical, MapPin,
} from "lucide-react";

import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatsCard from "@/components/dashboard/StatsCard";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import DonutChart from "@/components/dashboard/DonutChart";
import QuickStatsList from "@/components/dashboard/QuickStatsList";

/* ─── Sidebar ─── */
const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord" },
  { icon: <Users size={18} />, label: "Utilisateurs", chevron: true },
  {
    icon: <Briefcase size={18} />, label: "Emploi", active: true, chevron: true, expanded: true,
    subItems: ["Toutes les offres", "Ajouter une offre", "Catégories d'emploi", "Candidatures", "Entretiens", "Entreprises", "Statistiques"],
    activeSubIndex: 0,
  },
  { icon: <BookOpen size={18} />, label: "Formations", chevron: true },
  { icon: <Calendar size={18} />, label: "Événements", chevron: true },
  { icon: <Newspaper size={18} />, label: "Contenus", chevron: true },
  { icon: <Share2 size={18} />, label: "Communication", chevron: true },
  { icon: <BarChart3 size={18} />, label: "Rapports", chevron: true },
  { icon: <Settings size={18} />, label: "Paramètres", chevron: true },
];

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    value: "128", label: "Total des offres", trend: "+12%", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>,
    value: "86", label: "Offres actives", trend: "+18%", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    value: "24", label: "Offres en attente", trend: "-5%", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m12 18 4-4"/><path d="M8 18h8"/></svg>,
    value: "12", label: "Offres expirées", trend: "-8%", bg: "#F3E8FF", color: "#7C3AED",
  },
];

/* ─── Table Data ─── */
const offres = [
  {
    id: "#JOB001", titre: "Chargé de Communication", entreprise: "Enabel Niger", logo: "/logos/enabel.png",
    lieu: "Niamey", contrat: "CDI", contratColor: "#10632D", candidatures: 24,
    statut: "Active", statutColor: "#10632D", statutBg: "#E8F5ED", date: "12 Mars 2024",
  },
  {
    id: "#JOB002", titre: "Développeur Web", entreprise: "GIZ Niger", logo: "/logos/giz.png",
    lieu: "Niamey", contrat: "CDD", contratColor: "#E57617", candidatures: 18,
    statut: "Active", statutColor: "#10632D", statutBg: "#E8F5ED", date: "10 Mars 2024",
  },
  {
    id: "#JOB003", titre: "Spécialiste Suivi & Évaluation", entreprise: "PNUD Niger", logo: "/logos/pnud.png",
    lieu: "Niamey", contrat: "CDI", contratColor: "#10632D", candidatures: 32,
    statut: "En attente", statutColor: "#D97706", statutBg: "#FFFBE8", date: "08 Mars 2024",
  },
  {
    id: "#JOB004", titre: "Assistant Administratif", entreprise: "Banque Mondiale", logo: "/logos/bm.png",
    lieu: "Zinder", contrat: "CDD", contratColor: "#E57617", candidatures: 15,
    statut: "Active", statutColor: "#10632D", statutBg: "#E8F5ED", date: "05 Mars 2024",
  },
  {
    id: "#JOB005", titre: "Expert en Formation", entreprise: "AFD Niger", logo: "/logos/afd.png",
    lieu: "Maradi", contrat: "Consultant", contratColor: "#2563EB", candidatures: 27,
    statut: "Active", statutColor: "#10632D", statutBg: "#E8F5ED", date: "02 Mars 2024",
  },
  {
    id: "#JOB006", titre: "Chef de Projet Digital", entreprise: "SANE", logo: "/logos/sane.png",
    lieu: "Niamey", contrat: "CDI", contratColor: "#10632D", candidatures: 41,
    statut: "Active", statutColor: "#10632D", statutBg: "#E8F5ED", date: "28 Fév 2024",
  },
  {
    id: "#JOB007", titre: "Responsable RH", entreprise: "UNICEF Niger", logo: "/logos/unicef.png",
    lieu: "Agadez", contrat: "CDI", contratColor: "#10632D", candidatures: 19,
    statut: "En revue", statutColor: "#2563EB", statutBg: "#E0F0FF", date: "25 Fév 2024",
  },
  {
    id: "#JOB008", titre: "Formateur en Entrepreneuriat", entreprise: "PNUD Niger", logo: "/logos/pnud.png",
    lieu: "Niamey", contrat: "Consultant", contratColor: "#2563EB", candidatures: 23,
    statut: "Active", statutColor: "#10632D", statutBg: "#E8F5ED", date: "20 Fév 2024",
  },
  {
    id: "#JOB009", titre: "Analyste de Données", entreprise: "Banque Mondiale", logo: "/logos/bm.png",
    lieu: "Tahoua", contrat: "CDD", contratColor: "#E57617", candidatures: 17,
    statut: "Active", statutColor: "#10632D", statutBg: "#E8F5ED", date: "18 Fév 2024",
  },
  {
    id: "#JOB010", titre: "Coordinateur de Programme", entreprise: "Enabel Niger", logo: "/logos/enabel.png",
    lieu: "Niamey", contrat: "CDI", contratColor: "#10632D", candidatures: 29,
    statut: "Active", statutColor: "#10632D", statutBg: "#E8F5ED", date: "15 Fév 2024",
  },
];

/* ─── Donut chart segments ─── */
const donutSegments = [
  { label: "Administration", value: 36, pct: 28, color: "#10632D" },
  { label: "Communication", value: 23, pct: 18, color: "#E57617" },
  { label: "Informatique", value: 20, pct: 16, color: "#2563EB" },
  { label: "Éducation", value: 15, pct: 12, color: "#7C3AED" },
  { label: "Santé", value: 13, pct: 10, color: "#DB2777" },
  { label: "Autres", value: 21, pct: 16, color: "#61756B" },
];

/* ─── Right sidebar quick stats ─── */
const quickStats = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/></svg>, value: "286", label: "Candidatures reçues", trend: "+22%", color: "#10632D" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>, value: "12", label: "Offres publiées", trend: "+33%", color: "#E57617" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/></svg>, value: "86", label: "Offres actives", trend: "+18%", color: "#2563EB" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>, value: "24", label: "Offres en attente", trend: "-5%", color: "#7C3AED" },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9H9.41l1.3-1.29c.18-.19.29-.44.29-.71a1.003 1.003 0 0 0-1.71-.71L7 10.59V9c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1zm1-4l5 5h-5V7z"/></svg>, value: "12", label: "Offres expirées", trend: "-8%", color: "#DC2626" },
];


export default function EmploiPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          searchPlaceholder="Rechercher une offre d'emploi, une entreprise, un poste..."
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
                  <span>Emploi</span>
                  <span>&rsaquo;</span>
                  <span className="font-semibold text-[#0a2e16]">Offres d&apos;emploi</span>
                </div>
                <h1 className="text-[28px] font-extrabold text-[#0a2e16] leading-tight">Gestion des offres d&apos;emploi</h1>
                <p className="mt-1.5 max-w-[420px] text-[11px] text-[#61756B] leading-relaxed">
                  Publiez, modifiez et gérez toutes les offres d&apos;emploi. Suivez les candidatures<br />
                  et trouvez les meilleurs talents pour le Niger.
                </p>
              </div>
              <div className="relative flex-1 min-h-[160px]">
                <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=400&fit=crop&crop=faces&facepad=3" alt="emploi" fill className="object-cover object-center" />
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
              Ajouter une offre
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-4 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid gap-3 overflow-hidden" style={{ gridTemplateColumns: "minmax(0,1fr) 260px" }}>
            {/* Left: filter + table */}
            <div className="flex flex-col gap-3">
              <FilterBar searchPlaceholder="Rechercher une offre..." filters={["Catégorie", "Type de contrat", "Lieu (Niamey, Zinder...)", "Statut"]} />

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-[#DDE8E0] bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#DDE8E0] bg-[#F5F9F6]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Titre du poste <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Entreprise <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Lieu <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Type de contrat <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Candidatures <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date de publication <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offres.map((o, i) => (
                      <tr key={i} className="border-b border-[#DDE8E0] last:border-0 hover:bg-[#F5F9F6]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" /></td>
                        <td className="px-2 py-2 max-w-[170px]">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F9F6] border border-[#DDE8E0]">
                              <span className="text-[7px] font-bold text-[#10632D]">{o.entreprise.split(" ")[0].substring(0, 5)}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-[#0a2e16] leading-tight truncate">{o.titre}</p>
                              <p className="text-[9px] text-[#61756B]">{o.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[#0a2e16] font-medium">{o.entreprise}</p>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-0.5">
                            <MapPin size={10} className="text-[#E57617] shrink-0" />
                            <p className="text-[10px] text-[#0a2e16] font-medium">{o.lieu}</p>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${o.contratColor}18`, color: o.contratColor }}>
                            {o.contrat}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="text-[11px] font-semibold text-[#0a2e16]">{o.candidatures}</span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: o.statutBg, color: o.statutColor }}>
                            {o.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[#0a2e16] font-medium whitespace-nowrap">{o.date}</p>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="text-[#2563EB] hover:opacity-80"><Eye size={13} /></button>
                            <button className="text-[#10632D] hover:opacity-80"><Pencil size={13} /></button>
                            <button className="text-[#61756B] hover:opacity-80"><Copy size={13} /></button>
                            <button className="text-[#DC2626] hover:opacity-80"><Trash2 size={13} /></button>
                            <button className="text-[#61756B] hover:opacity-80"><MoreVertical size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination current={1} totalPages={13} totalItems={128} itemLabel="offres" />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-3 overflow-hidden w-full">
              <QuickStatsList heading="Statistiques rapides" subtitle="Ce mois" items={quickStats} />

              {/* Donut chart */}
              <DonutChart title="Répartition par secteur" segments={donutSegments} centerValue="128" centerLabel="Offres" showValues={false} showViewAll />

              {/* Entreprises qui recrutent */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#E57617]" />
                    <span className="text-[11px] font-bold text-[#0a2e16]">Entreprises qui recrutent</span>
                  </div>
                  <button className="shrink-0 ml-1 text-[9px] font-semibold text-[#E57617]">Voir toutes</button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[11px] font-bold" style={{ color: "#E57617" }}>Enabel<sup className="text-[5px] relative -top-1">*</sup></span>
                  <span className="text-[14px] font-extrabold italic" style={{ color: "#10632D" }}>giz</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2563EB]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#2563EB" strokeWidth="1" fill="none" />
                      <path d="M7 16c1-3 3-5 5-6s4 0 5 2" stroke="#2563EB" strokeWidth="1.2" fill="none" />
                      <path d="M6 10c2 1 4 1 6 0s4-1 6 0" stroke="#2563EB" strokeWidth="0.8" fill="none" />
                    </svg>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a2e16]">
                    <span className="text-[7px] font-bold text-white leading-none tracking-tight">AFD</span>
                  </div>
                  <svg width="30" height="22" viewBox="0 0 60 40" fill="none">
                    <path d="M10 30c3-8 8-14 14-18s12-4 16-1c3 2 4 6 2 10s-6 8-12 10-14 1-20-1z" fill="#00AEEF" opacity="0.2" />
                    <text x="30" y="28" textAnchor="middle" fill="#00AEEF" fontSize="10" fontWeight="700">unicef</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
