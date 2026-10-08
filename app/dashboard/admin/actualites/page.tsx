"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar,
  Newspaper, BarChart3, Settings, Share2,
  Eye, Pencil, Copy, Trash2, MoreVertical, Star,
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
const sidebarItems = adminNav("Actualités", 0);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
    value: "86", label: "Total des actualités", trend: "+22%", bg: "var(--sane-green-tint)", color: "var(--sane-green)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>,
    value: "12", label: "Brouillons", trend: "+8%", bg: "var(--sane-orange-tint)", color: "var(--sane-orange)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>,
    value: "54.2K", label: "Vues totales", trend: "+35%", bg: "var(--sane-blue-tint)", color: "var(--sane-blue)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    value: "320", label: "Commentaires", trend: "+18%", bg: "var(--sane-purple-tint)", color: "var(--sane-purple)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    value: "12", label: "Actualités en vedette", trend: "+33%", bg: "var(--sane-amber-tint)", color: "var(--sane-amber-dark)",
  },
];

/* ─── Table Data ─── */
const actualites = [
  {
    id: 1, titre: "Lancement officiel du Salon National de l'Emploi 2024", categorie: "Événement", catColor: "var(--sane-green)",
    auteur: "Admin", auteurImg: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "12 Mars 2024", vues: 2850, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    vedette: true, img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&h=56&fit=crop",
  },
  {
    id: 2, titre: "Le Niger mise sur la formation des jeunes pour l'avenir", categorie: "Formation", catColor: "var(--sane-orange)",
    auteur: "Fatima Bello", auteurImg: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "10 Mars 2024", vues: 1920, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    vedette: false, img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=80&h=56&fit=crop",
  },
  {
    id: 3, titre: "Nouveau partenariat avec l'AFD pour l'emploi des jeunes", categorie: "Partenariat", catColor: "var(--sane-blue)",
    auteur: "Ibrahim Touré", auteurImg: "https://randomuser.me/api/portraits/men/45.jpg",
    date: "08 Mars 2024", vues: 1650, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    vedette: false, img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=80&h=56&fit=crop",
  },
  {
    id: 4, titre: "Focus sur les métiers du numérique au SANEM 2024", categorie: "Emploi", catColor: "var(--sane-purple)",
    auteur: "Aicha Souley", auteurImg: "https://randomuser.me/api/portraits/women/68.jpg",
    date: "05 Mars 2024", vues: 2340, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    vedette: true, img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=80&h=56&fit=crop",
  },
  {
    id: 5, titre: "Témoignages : des jeunes trouvent des opportunités grâce au SANEM", categorie: "Témoignage", catColor: "var(--sane-cyan)",
    auteur: "Omar Issa", auteurImg: "https://randomuser.me/api/portraits/men/52.jpg",
    date: "02 Mars 2024", vues: 1280, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    vedette: false, img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=80&h=56&fit=crop",
  },
  {
    id: 6, titre: "Conférence : Les défis de l'emploi des jeunes au Niger", categorie: "Conférence", catColor: "var(--sane-pink)",
    auteur: "Nadia Saidou", auteurImg: "https://randomuser.me/api/portraits/women/33.jpg",
    date: "28 Fév 2024", vues: 1760, statut: "En attente", statutColor: "var(--sane-amber-dark)", statutBg: "var(--sane-amber-tint)",
    vedette: false, img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=80&h=56&fit=crop",
  },
  {
    id: 7, titre: "Atelier sur les compétences numériques pour l'emploi", categorie: "Atelier", catColor: "var(--sane-amber-dark)",
    auteur: "Yacoubou Sani", auteurImg: "https://randomuser.me/api/portraits/men/61.jpg",
    date: "25 Fév 2024", vues: 1450, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    vedette: false, img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=56&fit=crop",
  },
  {
    id: 8, titre: "Signature d'un accord avec l'Union Européenne", categorie: "Partenariat", catColor: "var(--sane-blue)",
    auteur: "Khadija Ali", auteurImg: "https://randomuser.me/api/portraits/women/55.jpg",
    date: "22 Fév 2024", vues: 2120, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    vedette: true, img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=80&h=56&fit=crop",
  },
  {
    id: 9, titre: "Les femmes au cœur de l'emploi : une initiative inspirante", categorie: "Inclusion", catColor: "var(--sane-emerald)",
    auteur: "Ahmed Mahamane", auteurImg: "https://randomuser.me/api/portraits/men/36.jpg",
    date: "20 Fév 2024", vues: 1880, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)",
    vedette: false, img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=56&fit=crop",
  },
  {
    id: 10, titre: "Préparatifs du SANEM 2024 : les coulisses de l'organisation", categorie: "Organisation", catColor: "var(--sane-text-light)",
    auteur: "Mariama Amadou", auteurImg: "https://randomuser.me/api/portraits/women/42.jpg",
    date: "18 Fév 2024", vues: 1320, statut: "Brouillon", statutColor: "var(--sane-text-light)", statutBg: "var(--sane-background)",
    vedette: false, img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=80&h=56&fit=crop",
  },
];

/* ─── Donut chart segments ─── */
const donutSegments = [
  { label: "Événement", value: 22, pct: 25, color: "var(--sane-green)" },
  { label: "Formation", value: 15, pct: 18, color: "var(--sane-orange)" },
  { label: "Partenariat", value: 14, pct: 16, color: "var(--sane-blue)" },
  { label: "Emploi", value: 12, pct: 14, color: "var(--sane-purple)" },
  { label: "Témoignage", value: 9, pct: 10, color: "var(--sane-cyan)" },
  { label: "Conférence", value: 7, pct: 8, color: "var(--sane-pink)" },
  { label: "Atelier", value: 5, pct: 6, color: "var(--sane-amber-dark)" },
  { label: "Inclusion", value: 2, pct: 3, color: "var(--sane-emerald)" },
];

/* ─── Top actualités (vues) ─── */
const topActualitesData = [
  { rank: 1, title: "Lancement officiel du SANEM 2024", subtitle: "2,850 vues" },
  { rank: 2, title: "Focus sur les métiers du numérique", subtitle: "2,340 vues" },
  { rank: 3, title: "Accord avec l'Union Européenne", subtitle: "2,120 vues" },
  { rank: 4, title: "Formation des jeunes pour l'avenir", subtitle: "1,920 vues" },
  { rank: 5, title: "Les femmes au cœur de l'emploi", subtitle: "1,880 vues" },
];

/* ─── Actualités récentes ─── */
const recentesData = [
  { day: "12", month: "Mar", title: "Lancement officiel du SANEM 2024", subtitle: "Publié" },
  { day: "10", month: "Mar", title: "Formation des jeunes pour l'avenir", subtitle: "Publié" },
  { day: "08", month: "Mar", title: "Partenariat avec l'AFD", subtitle: "Publié" },
  { day: "05", month: "Mar", title: "Métiers du numérique", subtitle: "Publié" },
  { day: "02", month: "Mar", title: "Témoignages des jeunes", subtitle: "Publié" },
];

export default function ActualitesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(actualites, { filterKeys: {"Catégorie":"categorie","Statut":"statut","Auteur":"auteur"} });
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher une actualité, un mot-clé, une catégorie..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Hero Banner - dark variant */}
          <div className="relative mb-4 min-h-[120px] sm:h-[160px] overflow-hidden rounded-2xl bg-[var(--sane-green-deep)]">
            <div className="absolute right-0 top-0 h-full w-full sm:w-[55%]">
              <Image src="https://images.unsplash.com/photo-1611432579699-484f7990b127?w=800&h=400&fit=crop" alt="actualités" fill sizes="100vw" className="object-cover" />
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
                <span>Accueil</span><span>&rsaquo;</span><span>Actualités</span><span>&rsaquo;</span>
                <span className="font-semibold text-white">Toutes les actualités</span>
              </div>
              <h1 className="text-[20px] sm:text-[26px] font-extrabold text-white leading-tight">Gestion des actualités</h1>
              <p className="mt-1 max-w-[420px] text-[11px] text-white/80 leading-relaxed hidden sm:block">
                Créez, publiez et gérez toutes les actualités du SANEM. Informez votre communauté sur les événements, les annonces, les partenariats et les initiatives.
              </p>
              <button type="button" onClick={tbl.openAdd} className="mt-3 self-start flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow sm:hidden">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Ajouter une actualité
              </button>
            </div>
            <button type="button" onClick={tbl.openAdd} className="absolute right-10 top-5 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter une actualité
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
              <FilterBar searchPlaceholder="Rechercher une actualité..." filters={["Catégorie", "Statut", "Auteur", "Date de publication"]}  table={tbl} />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Image</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Titre de l&apos;actualité <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Catégorie</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Auteur</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Date de publication <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Vues <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Statut</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">En vedette <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((a) => (
                      <tr key={a.id} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.selected.includes(a._uid)} onChange={() => tbl.toggle(a._uid)} /></td>
                        <td className="px-2 py-1.5">
                          <div className="relative h-9 w-[56px] overflow-hidden rounded-md border border-[var(--sane-border)]">
                            <Image src={a.img} alt={a.titre} fill sizes="100vw" className="object-cover object-center" />
                          </div>
                        </td>
                        <td className="px-2 py-2.5 min-w-[220px] max-w-[280px]">
                          <p className="text-[12px] font-semibold text-[var(--sane-green-deep)] leading-snug line-clamp-2">{a.titre}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `color-mix(in srgb, ${a.catColor} 9%, transparent)`, color: a.catColor }}>
                            {a.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                              <Image src={a.auteurImg} alt={a.auteur} fill sizes="100vw" className="object-cover" />
                            </div>
                            <span className="text-[10px] text-[var(--sane-green-deep)] font-medium whitespace-nowrap">{a.auteur}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <p className="text-[10px] text-[var(--sane-green-deep)] font-medium whitespace-nowrap">{a.date}</p>
                        </td>
                        <td className="px-2 py-2">
                          <span className="text-[10px] font-semibold text-[var(--sane-green-deep)]">{a.vues.toLocaleString()}</span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: a.statutBg, color: a.statutColor }}>
                            {a.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          {a.vedette ? (
                            <Star size={14} className="inline text-[var(--sane-amber-dark)]" fill="var(--sane-amber-dark)" />
                          ) : (
                            <Star size={14} className="inline text-[var(--sane-border)]" />
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <RowActions table={tbl} row={a} extra="duplicate" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="actualités" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:flex 2xl:flex-col gap-3 min-w-0">
              <DonutChart title="Répartition par catégorie" segments={donutSegments} centerValue="86" centerLabel="Actualités" showValues={false} />
              <RankedList heading="Top actualités (vues)" items={topActualitesData} showViewAll />
              <DateBadgeList heading="Actualités récentes" items={recentesData} showViewAll />
            </div>
          </div>
        </main>
      </div>
      <TableDialogs table={tbl} entity="actualité" />
    </div>
  );
}
