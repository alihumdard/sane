"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Share2, Eye, Pencil, Trash2, MoreVertical,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { adminNav } from "@/lib/adminNav";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { useTable } from "@/components/dashboard/useTable";
import RowActions from "@/components/dashboard/RowActions";
import TableDialogs from "@/components/dashboard/TableDialogs";
import StatsCard from "@/components/dashboard/StatsCard";
import HeroBanner from "@/components/dashboard/HeroBanner";
import FilterBar from "@/components/dashboard/FilterBar";
import DonutChart from "@/components/dashboard/DonutChart";
import RankedList from "@/components/dashboard/RankedList";
import EnterpriseLogo from "@/components/dashboard/EnterpriseLogo";
import Pagination from "@/components/dashboard/Pagination";

/* ─── Sidebar ─── */
const sidebarItems = adminNav("Emploi", 3);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/><path d="M9 13h6v2H9zm0-3h6v2H9z"/></svg>,
    value: "286", label: "Total candidatures", trend: "+22%", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
    value: "124", label: "En attente", trend: "+18%", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "96", label: "Présélectionnées", trend: "+12%", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
    value: "48", label: "En entretien", trend: "+8%", bg: "#F3E8FF", color: "#7C3AED",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>,
    value: "18", label: "Recrutées", trend: "+25%", bg: "#FFFBE8", color: "#D97706",
  },
];

/* ─── Table Data ─── */
const candidatures = [
  { photo: "https://randomuser.me/api/portraits/men/11.jpg", nom: "Moussa Diallo", ville: "Niamey", id: "#JOB002", poste: "Développeur Web", entreprise: "GIZ Niger", eLogo: "giz", date: "12 Mars 2024", statut: "En attente", statutColor: "#E57617", statutBg: "#FFF3E8" },
  { photo: "https://randomuser.me/api/portraits/women/21.jpg", nom: "Fatima Bello", ville: "Zinder", id: "#JOB004", poste: "Assistant Administratif", entreprise: "Banque Mondiale", eLogo: "bm", date: "11 Mars 2024", statut: "Présélectionnée", statutColor: "#2563EB", statutBg: "#E0F0FF" },
  { photo: "https://randomuser.me/api/portraits/men/33.jpg", nom: "Ibrahim Touré", ville: "Niamey", id: "#JOB001", poste: "Chargé de Communication", entreprise: "Enabel Niger", eLogo: "enabel", date: "10 Mars 2024", statut: "En entretien", statutColor: "#7C3AED", statutBg: "#F3E8FF" },
  { photo: "https://randomuser.me/api/portraits/women/34.jpg", nom: "Aicha Souley", ville: "Maradi", id: "#JOB003", poste: "Spécialiste Suivi & Évaluation", entreprise: "PNUD Niger", eLogo: "pnud", date: "09 Mars 2024", statut: "Présélectionnée", statutColor: "#2563EB", statutBg: "#E0F0FF" },
  { photo: "https://randomuser.me/api/portraits/men/55.jpg", nom: "Omar Issa", ville: "Agadez", id: "#JOB005", poste: "Expert en Formation", entreprise: "AFD Niger", eLogo: "afd", date: "08 Mars 2024", statut: "Recrutée", statutColor: "#10632D", statutBg: "#E8F5ED" },
  { photo: "https://randomuser.me/api/portraits/women/56.jpg", nom: "Nadia Saidou", ville: "Niamey", id: "#JOB007", poste: "Responsable RH", entreprise: "UNICEF Niger", eLogo: "unicef", date: "07 Mars 2024", statut: "En attente", statutColor: "#E57617", statutBg: "#FFF3E8" },
  { photo: "https://randomuser.me/api/portraits/men/61.jpg", nom: "Yacoubou Sani", ville: "Tahoua", id: "#JOB008", poste: "Formateur en Entrepreneuriat", entreprise: "PNUD Niger", eLogo: "pnud", date: "06 Mars 2024", statut: "En entretien", statutColor: "#7C3AED", statutBg: "#F3E8FF" },
  { photo: "https://randomuser.me/api/portraits/women/62.jpg", nom: "Khadija Ali", ville: "Niamey", id: "#JOB010", poste: "Coordinateur de Programme", entreprise: "SANEM", eLogo: "sane", date: "05 Mars 2024", statut: "Présélectionnée", statutColor: "#2563EB", statutBg: "#E0F0FF" },
  { photo: "https://randomuser.me/api/portraits/men/63.jpg", nom: "Ahmed Mahamane", ville: "Zinder", id: "#JOB009", poste: "Analyste de Données", entreprise: "Banque Mondiale", eLogo: "bm", date: "04 Mars 2024", statut: "En attente", statutColor: "#E57617", statutBg: "#FFF3E8" },
  { photo: "https://randomuser.me/api/portraits/women/64.jpg", nom: "Mariama Amadou", ville: "Niamey", id: "#JOB006", poste: "Chef de Projet Digital", entreprise: "SANEM", eLogo: "sane", date: "02 Mars 2024", statut: "Recrutée", statutColor: "#10632D", statutBg: "#E8F5ED" },
];

/* ─── Donut segments ─── */
const statuses = [
  { label: "En attente", value: 124, pct: 43, color: "#E57617" },
  { label: "Présélectionnée", value: 96, pct: 34, color: "#2563EB" },
  { label: "En entretien", value: 48, pct: 17, color: "#7C3AED" },
  { label: "Recrutée", value: 18, pct: 6, color: "#10632D" },
];

/* ─── Top postes ─── */
const topPostes = [
  { rank: 1, title: "Développeur Web", subtitle: "64 candidatures" },
  { rank: 2, title: "Assistant Administratif", subtitle: "42 candidatures" },
  { rank: 3, title: "Chargé de Communication", subtitle: "38 candidatures" },
  { rank: 4, title: "Expert en Formation", subtitle: "26 candidatures" },
  { rank: 5, title: "Responsable RH", subtitle: "24 candidatures" },
];

/* ─── Top entreprises ─── */
const topEntreprises = [
  { nom: "SANEM", count: 72, logo: "sane" },
  { nom: "Banque Mondiale", count: 58, logo: "bm" },
  { nom: "PNUD Niger", count: 46, logo: "pnud" },
  { nom: "Enabel Niger", count: 38, logo: "enabel" },
  { nom: "GIZ Niger", count: 32, logo: "giz" },
];

function DocIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#10632D" : "none"} stroke={filled ? "#10632D" : "#94A3B8"} strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export default function CandidaturesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(candidatures, { filterKeys: {"Tous les postes":"poste","Tous les statuts":"statut","Toutes les entreprises":"entreprise"} });
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher une candidature, un candidat, un poste, une entreprise..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Breadcrumb */}
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[var(--sane-text-light)]">
            <span>Accueil</span>
            <span className="text-[var(--sane-border)]">&rsaquo;</span>
            <span>Emploi</span>
            <span className="text-[var(--sane-border)]">&rsaquo;</span>
            <span className="font-semibold text-[var(--sane-green-deep)]">Candidatures</span>
          </div>

          <HeroBanner
            title="Gestion des candidatures"
            description="Consultez et gérez toutes les candidatures reçues. Filtrez, évaluez, planifiez les entretiens et suivez l'état de chaque candidature."
            imageSrc="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=400&fit=crop"
          />

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
              <FilterBar
                searchPlaceholder="Rechercher un candidat..."
                filters={["Tous les postes", "Tous les statuts", "Toutes les entreprises", "Date de candidature"]}
               table={tbl} />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Candidat <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Poste</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Entreprise</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Statut <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">CV</th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Lettre</th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((c, i) => (
                      <tr key={i} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.selected.includes(c._uid)} onChange={() => tbl.toggle(c._uid)} /></td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full border border-[var(--sane-border)] shrink-0">
                              <Image src={c.photo} alt={c.nom} width={32} height={32} className="object-cover" />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-[var(--sane-green-deep)] leading-tight">{c.nom}</p>
                              <p className="text-[9px] text-[var(--sane-text-light)]">{c.ville}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2.5 min-w-[170px] max-w-[220px]">
                          <p className="text-[12px] font-semibold text-[var(--sane-green-deep)] leading-snug">{c.poste}</p>
                          <p className="text-[9px] text-[var(--sane-text-light)]">{c.id}</p>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1.5">
                            <EnterpriseLogo code={c.eLogo} />
                            <span className="text-[11px] text-[var(--sane-green-deep)]">{c.entreprise}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span className="whitespace-nowrap text-[11px] text-[var(--sane-green-deep)]">{c.date}</span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: c.statutBg, color: c.statutColor }}>
                            {c.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center"><DocIcon filled /></td>
                        <td className="px-2 py-2 text-center"><DocIcon filled={i % 2 === 0} /></td>
                        <td className="px-2 py-2">
                          <RowActions table={tbl} row={c} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="candidatures" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:flex 2xl:flex-col gap-3 min-w-0">
              <DonutChart
                title="Statut des candidatures"
                segments={statuses}
                centerValue="286"
                centerLabel="Candidatures"
              />

              <RankedList
                heading="Top 5 postes les plus demandés"
                items={topPostes}
              />

              <RankedList
                heading="Entreprises les plus actives"
                items={topEntreprises.map(e => ({
                  rank: 0,
                  title: e.nom,
                  subtitle: `${e.count} candidatures`,
                  icon: <EnterpriseLogo code={e.logo} size={32} />,
                }))}
                showViewAll
                className="flex-1"
              />
            </div>
          </div>
        </main>
      </div>
      <TableDialogs table={tbl} entity="candidature" />
    </div>
  );
}
