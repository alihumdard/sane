"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Eye, Pencil, Copy, Trash2, MoreVertical,
  BarChart3, Settings, FileText, Share2,
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
const sidebarItems = adminNav("FAQ", 0);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>,
    value: "48", label: "Questions totales", trend: "+20%", bg: "var(--sane-green-tint)", color: "var(--sane-green)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>,
    value: "8", label: "Catégories", trend: "+14%", bg: "var(--sane-orange-tint)", color: "var(--sane-orange)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
    value: "12.4K", label: "Vues totales", trend: "+35%", bg: "var(--sane-blue-tint)", color: "var(--sane-blue)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "3.8K", label: "Utilisateurs uniques", trend: "+28%", bg: "var(--sane-purple-tint)", color: "var(--sane-purple)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
    value: "4.7", label: "Note moyenne", trend: "+12%", bg: "var(--sane-amber-tint)", color: "var(--sane-amber-dark)",
  },
];

/* ─── Table Data ─── */
const questions = [
  { question: "Comment puis-je m'inscrire au Salon National de l'Emploi ?", categorie: "Inscription", catColor: "var(--sane-green)", vues: 2540, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "12 Mars 2024" },
  { question: "La participation au SANEM est-elle gratuite ?", categorie: "Général", catColor: "var(--sane-text-light)", vues: 1980, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "10 Mars 2024" },
  { question: "Quels sont les documents nécessaires ?", categorie: "Documents", catColor: "var(--sane-purple)", vues: 1760, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "08 Mars 2024" },
  { question: "Comment postuler aux offres d'emploi ?", categorie: "Emploi", catColor: "var(--sane-orange)", vues: 1520, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "05 Mars 2024" },
  { question: "Comment devenir exposant ou partenaire ?", categorie: "Partenariat", catColor: "var(--sane-blue)", vues: 1340, statut: "Brouillon", statutColor: "var(--sane-amber-dark)", statutBg: "var(--sane-amber-tint)", date: "02 Mars 2024" },
  { question: "Y a-t-il des formations pendant le salon ?", categorie: "Formation", catColor: "var(--sane-cyan)", vues: 1210, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "28 Fév 2024" },
  { question: "Comment accéder aux conférences ?", categorie: "Événements", catColor: "var(--sane-pink)", vues: 1090, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "25 Fév 2024" },
  { question: "Le salon est-il ouvert aux étudiants ?", categorie: "Étudiants", catColor: "var(--sane-emerald)", vues: 980, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "22 Fév 2024" },
  { question: "Où se déroule le SANEM 2024 ?", categorie: "Lieu", catColor: "var(--sane-purple)", vues: 860, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "20 Fév 2024" },
  { question: "Comment contacter l'équipe organisatrice ?", categorie: "Contact", catColor: "var(--sane-orange)", vues: 740, statut: "Publié", statutColor: "var(--sane-green)", statutBg: "var(--sane-green-tint)", date: "18 Fév 2024" },
];

/* ─── Donut chart segments ─── */
const donutSegments = [
  { label: "Inscription", value: 11, pct: 22, color: "var(--sane-green)" },
  { label: "Emploi", value: 9, pct: 18, color: "var(--sane-orange)" },
  { label: "Formation", value: 7, pct: 15, color: "var(--sane-cyan)" },
  { label: "Partenariat", value: 6, pct: 12, color: "var(--sane-blue)" },
  { label: "Événements", value: 5, pct: 10, color: "var(--sane-pink)" },
  { label: "Documents", value: 4, pct: 8, color: "var(--sane-purple)" },
  { label: "Général", value: 4, pct: 8, color: "var(--sane-text-light)" },
  { label: "Autres", value: 2, pct: 7, color: "var(--sane-slate)" },
];

/* ─── Top questions ─── */
const topQuestionsData = [
  { rank: 1, title: "Comment puis-je m'inscrire au SANEM ?", subtitle: "2,540 vues" },
  { rank: 2, title: "La participation est-elle gratuite ?", subtitle: "1,980 vues" },
  { rank: 3, title: "Quels sont les documents nécessaires ?", subtitle: "1,760 vues" },
  { rank: 4, title: "Comment postuler aux offres d'emploi ?", subtitle: "1,520 vues" },
  { rank: 5, title: "Comment devenir partenaire ?", subtitle: "1,340 vues" },
];

/* ─── Questions récentes ─── */
const recentQuestions = [
  { day: "12", month: "Mar", title: "Comment s'inscrire au SANEM ?", subtitle: "Publié" },
  { day: "10", month: "Mar", title: "La participation est-elle gratuite ?", subtitle: "Publié" },
  { day: "08", month: "Mar", title: "Quels sont les documents ?", subtitle: "Publié" },
  { day: "05", month: "Mar", title: "Comment postuler aux offres ?", subtitle: "Publié" },
  { day: "02", month: "Mar", title: "Devenir exposant ou partenaire ?", subtitle: "Brouillon" },
];

export default function FaqPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(questions, { filterKeys: {"Catégorie":"categorie","Statut":"statut"} });
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher une question, une catégorie..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Hero Banner */}
          <div className="relative mb-4 min-h-[120px] sm:h-[170px] overflow-hidden rounded-2xl bg-[var(--sane-green-deep)]">
            <div className="absolute right-0 top-0 h-full w-full sm:w-[60%]">
              <Image src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&h=400&fit=crop" alt="faq" fill sizes="100vw" className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--sane-green-deep)] via-[var(--sane-green-deep)]/60 to-[var(--sane-green-deep)]/20 sm:via-[var(--sane-green-deep)]/30 sm:to-transparent" />
            </div>
            <div className="absolute right-32 top-1/2 -translate-y-1/2 opacity-30 hidden sm:block">
              <svg width="90" height="90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="white" opacity="0.15"/>
                <circle cx="50" cy="50" r="45" stroke="var(--sane-orange)" strokeWidth="2.5" fill="none" opacity="0.4" strokeDasharray="6 3"/>
                <text x="50" y="46" textAnchor="middle" fill="white" fontSize="12" fontWeight="800">SANEM</text>
                <text x="50" y="58" textAnchor="middle" fill="white" fontSize="5" fontWeight="600">SALON NATIONAL DE L&apos;EMPLOI</text>
              </svg>
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-right hidden sm:block">
              <p className="text-[22px] italic font-bold text-white leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Un Niger<br />de Talents
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-white/70">
                <span>Accueil</span><span>&rsaquo;</span><span>FAQ</span><span>&rsaquo;</span>
                <span className="font-semibold text-white">Toutes les questions</span>
              </div>
              <h1 className="text-[20px] sm:text-[26px] font-extrabold text-white leading-tight">Gestion des FAQ</h1>
              <p className="mt-1 max-w-[420px] text-[11px] text-white/80 leading-relaxed hidden sm:block">
                Gérez toutes les questions fréquentes du SANEM. Organisez-les par catégories, mettez à jour les réponses et suivez les questions les plus consultées.
              </p>
              <button type="button" onClick={tbl.openAdd} className="mt-3 self-start flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow sm:hidden">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Ajouter une question
              </button>
            </div>
            <button type="button" onClick={tbl.openAdd} className="absolute right-10 top-6 hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter une question
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
              <FilterBar searchPlaceholder="Rechercher une question..." filters={["Catégorie", "Statut", "Popularité"]}  table={tbl} />

              <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                      <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Question</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Catégorie</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Vues <svg width="8" height="8" viewBox="0 0 10 14" fill="var(--sane-text-light)"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Statut</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Dernière mise à jour</th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((q, i) => (
                      <tr key={i} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                        <td className="px-3 py-2.5"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.selected.includes(q._uid)} onChange={() => tbl.toggle(q._uid)} /></td>
                        <td className="px-2 py-3 min-w-[300px] max-w-[420px]">
                          <p className="text-[12px] font-semibold text-[var(--sane-green-deep)] leading-snug">{q.question}</p>
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: `color-mix(in srgb, ${q.catColor} 9%, transparent)`, color: q.catColor }}>
                            {q.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-1">
                            <Eye size={12} className="text-[var(--sane-text-light)]" />
                            <span className="text-[11px] font-medium text-[var(--sane-green-deep)]">{q.vues.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: q.statutBg, color: q.statutColor }}>
                            {q.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="whitespace-nowrap text-[11px] text-[var(--sane-text-light)]">{q.date}</span>
                        </td>
                        <td className="px-2 py-2.5">
                          <RowActions table={tbl} row={q} extra="duplicate" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="questions" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:flex 2xl:flex-col gap-3 min-w-0">
              <DonutChart
                title="Répartition par catégorie"
                segments={donutSegments}
                centerValue="48"
                centerLabel="Questions"
                showValues={false}
              />
              <RankedList
                heading="Top questions (vues)"
                items={topQuestionsData}
                showViewAll
              />
              <DateBadgeList
                heading="Questions récentes"
                items={recentQuestions}
                showViewAll
                className="flex-1"
              />
            </div>
          </div>
        </main>
      </div>
      <TableDialogs table={tbl} entity="question" />
    </div>
  );
}
