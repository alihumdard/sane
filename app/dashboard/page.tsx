"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home, Building2, Briefcase, FileText, Users, UserCheck,
  Calendar, MessageSquare, Bell, BarChart3, Settings,
  Search, ChevronDown, Eye, Mail, MoreVertical, MapPin,
  Clock, Video, Edit, Globe, Star, ArrowRight, TrendingUp, Menu, X,
  Pencil, Trash2, XCircle, Search as SearchIcon
} from "lucide-react";
import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { useTable } from "@/components/dashboard/useTable";
import TableDialogs from "@/components/dashboard/TableDialogs";
import RowMenu from "@/components/dashboard/RowMenu";
import Pagination from "@/components/dashboard/Pagination";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord", href: "/dashboard", active: true },
  { icon: <Building2 size={18} />, label: "Profil de l'entreprise" },
  { icon: <Briefcase size={18} />, label: "Mes offres d'emploi", href: "/dashboard/admin/emploi" },
  { icon: <FileText size={18} />, label: "Candidatures reçues", href: "/dashboard/admin/candidatures" },
  { icon: <UserCheck size={18} />, label: "Candidats présélectionnés" },
  { icon: <Calendar size={18} />, label: "Entretiens" },
  { icon: <MessageSquare size={18} />, label: "Messages", badge: 5 },
  { icon: <Bell size={18} />, label: "Notifications", badge: 3, href: "/dashboard/admin/notifications" },
  { icon: <Calendar size={18} />, label: "Événements", href: "/dashboard/admin/evenements" },
  { icon: <BarChart3 size={18} />, label: "Statistiques", href: "/dashboard/admin/rapports" },
  { icon: <Settings size={18} />, label: "Paramètres", href: "/dashboard/admin/parametres" },
];

const statsData = [
  { icon: <Briefcase size={20} />, value: "12", label: "Offres d'emploi", trend: "+20%", trendLabel: "vs. mois dernier", color: "#E57617", bg: "#E57617" },
  { icon: <FileText size={20} />, value: "348", label: "Candidatures reçues", trend: "+35%", trendLabel: "vs. mois dernier", color: "#10632D", bg: "#10632D" },
  { icon: <Calendar size={20} />, value: "28", label: "Entretiens planifiés", trend: "+18%", trendLabel: "vs. mois dernier", color: "#10632D", bg: "#10632D" },
  { icon: <Star size={20} />, value: "56", label: "Candidats présélectionnés", trend: "+28%", trendLabel: "vs. mois dernier", color: "#E57617", bg: "#E57617" },
  { icon: <Eye size={20} />, value: "12.4K", label: "Vues de l'entreprise", trend: "+42%", trendLabel: "vs. mois dernier", color: "#10632D", bg: "#10632D" },
];

const chartData = [
  { month: "Jan", cand: 60, ent: 20 },
  { month: "Fév", cand: 80, ent: 30 },
  { month: "Mar", cand: 100, ent: 35 },
  { month: "Avr", cand: 70, ent: 25 },
  { month: "Mai", cand: 120, ent: 40 },
  { month: "Juin", cand: 90, ent: 30 },
  { month: "Juil", cand: 110, ent: 45 },
  { month: "Août", cand: 85, ent: 28 },
  { month: "Sep", cand: 140, ent: 50 },
  { month: "Oct", cand: 180, ent: 60 },
  { month: "Nov", cand: 160, ent: 55 },
  { month: "Déc", cand: 130, ent: 42 },
];

const donutData = [
  { label: "Technique", pct: 28, color: "#1e3a5f" },
  { label: "Administration", pct: 20, color: "#10632D" },
  { label: "Communication", pct: 15, color: "#3b82f6" },
  { label: "Finance", pct: 12, color: "#E57617" },
  { label: "Marketing", pct: 10, color: "#f59e0b" },
  { label: "Stages", pct: 8, color: "#8b5cf6" },
  { label: "Autres", pct: 7, color: "#94a3b8" },
];

const candidates = [
  { name: "Aminata Diallo", city: "Niamey", poste: "Chargé de communication", date: "12 Mars 2024", statut: "Nouveau", statutColor: "#10632D", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Ibrahim Souley", city: "Zinder", poste: "Technicien réseau", date: "10 Mars 2024", statut: "En revue", statutColor: "#E57617", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Fatouma Issa", city: "Niamey", poste: "Assistant administratif", date: "09 Mars 2024", statut: "Présélectionné", statutColor: "#3b82f6", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Moussa Adamou", city: "Maradi", poste: "Stagiaire IT", date: "08 Mars 2024", statut: "Nouveau", statutColor: "#10632D", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Aichatou Bello", city: "Niamey", poste: "Chargé de projet", date: "07 Mars 2024", statut: "En revue", statutColor: "#E57617", avatar: "https://randomuser.me/api/portraits/women/55.jpg" },
];

const topOffers = [
  { count: 320, title: "Assistant administratif", views: "12.4K vues", time: "Il y a 5 jours", color: "#10632D" },
  { count: 245, title: "Chargé de communication", views: "8.6K vues", time: "Il y a 1 semaine", color: "#E57617" },
  { count: 189, title: "Technicien informatique", views: "6.2K vues", time: "Il y a 2 semaines", color: "#10632D" },
];

const interviews = [
  { day: "15", month: "Mar", title: "Entretien - Assistant administratif", person: "Aminata Diallo", time: "10:00 - 10:30", type: "video", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { day: "18", month: "Mar", title: "Entretien - Technicien informatique", person: "Moussa Adamou", time: "14:00 - 14:30", type: "in-person", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
];

const messages = [
  { name: "Ibrahim Souley", preview: "Merci pour l'opportunité. Je suis disponible p...", time: "il y a 2 heures", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Fatouma Issa", preview: "Bonjour, je souhaite avoir plus d'informations...", time: "il y a 5 heures", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
];

const notifications = [
  { icon: <FileText size={14} />, iconBg: "#10632D", title: "Nouvelle candidature reçue", desc: "Aminata Diallo a postulé pour Assistant administratif", time: "il y a 1 heure" },
  { icon: <Calendar size={14} />, iconBg: "#3b82f6", title: "Entretien planifié", desc: "Entretien avec Moussa Adamou demain à 14h", time: "il y a 3 heures" },
  { icon: <Briefcase size={14} />, iconBg: "#E57617", title: "Nouvelle offre publiée avec succès", desc: "Votre offre a été publiée et est maintenant visible", time: "il y a 1 jour" },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(candidates, { filterKeys: { Statut: "statut" }, pageSize: 5 });
  const [interviewList, setInterviewList] = useState(interviews);
  const [readMessages, setReadMessages] = useState<string[]>([]);
  const [readNotifs, setReadNotifs] = useState<string[]>([]);
  const [company, setCompany] = useState({ name: "MTN Niger", secteur: "Télécommunications", ville: "Niamey, Niger", site: "www.mtn.ne" });
  const [companyDraft, setCompanyDraft] = useState<typeof company | null>(null);
  const soon = (what: string) => tbl.notify(`${what} : page bientôt disponible`);

  const scheduleInterview = (c: (typeof tbl.rows)[number]) => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    setInterviewList((l) => [
      { day: String(d.getDate()).padStart(2, "0"), month: months[d.getMonth()], title: `Entretien - ${c.poste}`, person: c.name, time: "09:00 - 09:30", type: "video", avatar: c.avatar },
      ...l,
    ]);
    tbl.notify(`Entretien planifié avec ${c.name}`);
  };

  const selectedRows = tbl.rows.filter((row) => tbl.selected.includes(row._uid));
  const maxCand = Math.max(...chartData.map((d) => d.cand));

  const conicGradient = (() => {
    let acc = 0;
    return donutData.map((d) => {
      const start = acc;
      acc += d.pct;
      return `${d.color} ${start * 3.6}deg ${acc * 3.6}deg`;
    }).join(", ");
  })();

  return (
    <div className="flex h-screen bg-[var(--sane-background)] overflow-hidden">
      {/* Mobile overlay */}
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ═══════════════════ MAIN ═══════════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* TOP NAVBAR */}
        <DashboardNavbar searchPlaceholder="Rechercher un candidat, une offre..." notificationCount={5} userName={company.name} userRole="Entreprise" onMenuClick={() => setSidebarOpen(true)} />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6">
          {/* ═══════════ WELCOME BANNER ═══════════ */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-white border border-[var(--sane-border)]">
            <div className="absolute right-0 top-0 hidden h-full w-[55%] sm:block">
              <Image src="/sane_deal.png" alt="Dashboard" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
            </div>
            <p className="absolute bottom-4 right-6 z-20 hidden sm:block text-[15px] italic text-[var(--sane-orange)]" style={{ fontFamily: "serif" }}>Un Niger<br/>de Talents</p>
            <div className="relative z-20 p-4 sm:p-6">
              <h1 className="mb-1 text-2xl font-extrabold text-[var(--sane-green-deep)]">Bienvenue, {company.name} !</h1>
              <p className="max-w-md text-[13px] text-[var(--sane-text-light)]">Trouvez les meilleurs talents et contribuez au développement des compétences au Niger avec le SANEM.</p>
            </div>
          </div>

          {/* ═══════════ STATS ROW ═══════════ */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 border-b border-[var(--sane-border)] bg-white rounded-xl px-4 py-3">
            {statsData.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span style={{ color: s.color }}>{s.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-[var(--sane-green-deep)]">{s.value}</span>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[var(--sane-green)]">
                      <TrendingUp size={10} /> {s.trend}
                    </span>
                    <span className="hidden text-[9px] text-[var(--sane-text-light)]/60 min-[420px]:inline">{s.trendLabel}</span>
                  </div>
                  <p className="text-[10px] text-[var(--sane-text-light)] truncate">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════ CHARTS ROW ═══════════ */}
          <div className="mb-6 grid grid-cols-1 xl:grid-cols-[1fr_280px_260px] gap-4">
            {/* Bar Chart */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[14px] font-bold text-[var(--sane-green-deep)]">Candidatures par mois</h3>
                </div>
                <select className="rounded border border-[var(--sane-border)] px-2 py-1 text-[10px] text-[var(--sane-text-light)] outline-none">
                  <option>Cette année</option>
                </select>
              </div>
              <div className="mb-3 flex items-center gap-4 text-[10px] text-[var(--sane-text-light)]">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--sane-green)]" /> Candidatures</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--sane-orange)]" /> Entretiens</span>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col justify-between text-[9px] text-[var(--sane-text-light)] pb-5">
                  <span>200</span><span>150</span><span>100</span><span>50</span><span>0</span>
                </div>
                <div className="relative flex flex-1 items-end gap-1">
                  {chartData.map((d, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex w-full items-end justify-center" style={{ height: 120 }}>
                        <div className="w-[65%] rounded-t bg-gradient-to-t from-[var(--sane-green-dark)] to-[var(--sane-green)]/60" style={{ height: `${(d.cand / 200) * 100}%` }} />
                      </div>
                      <span className="text-[9px] text-[var(--sane-text-light)]">{d.month}</span>
                    </div>
                  ))}
                  <svg className="pointer-events-none absolute inset-0 mb-5" viewBox={`0 0 ${chartData.length * 40} 120`} preserveAspectRatio="none" fill="none">
                    <polyline
                      points={chartData.map((d, i) => `${i * 40 + 20},${120 - (d.ent / 200) * 120}`).join(" ")}
                      stroke="#E57617"
                      strokeWidth="2"
                      fill="none"
                    />
                    {chartData.map((d, i) => (
                      <circle key={i} cx={i * 40 + 20} cy={120 - (d.ent / 200) * 120} r="4" fill="white" stroke="#E57617" strokeWidth="2" />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-4 bg-[var(--sane-orange)]" />
                <h3 className="text-[14px] font-bold text-[var(--sane-green-deep)]">Répartition des candidatures</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div
                    className="h-[100px] w-[100px] rounded-full"
                    style={{ background: `conic-gradient(${conicGradient})` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-[15px] font-extrabold text-[var(--sane-green-deep)]">348</span>
                      <span className="text-[7px] text-[var(--sane-text-light)]">Candidatures</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {donutData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px]">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[var(--sane-text-light)]">{d.label}</span>
                      <span className="ml-1 font-semibold text-[var(--sane-green-deep)]">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mon entreprise */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Mon entreprise</h3>
                </div>
                <button type="button" onClick={() => setCompanyDraft(company)} className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir le profil <ArrowRight size={10} /></button>
              </div>
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#f59e0b] bg-[#f59e0b]">
                  <span className="text-[9px] font-extrabold text-white">{company.name.slice(0, 3).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[var(--sane-green-deep)]">{company.name}</p>
                  <p className="text-[9px] text-[var(--sane-text-light)]">{company.secteur}</p>
                  <div className="flex items-center gap-2 text-[9px] text-[var(--sane-text-light)]">
                    <span className="flex items-center gap-0.5"><MapPin size={8} /> {company.ville}</span>
                    <span className="flex items-center gap-0.5"><Globe size={8} /> {company.site}</span>
                  </div>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-3 gap-1 text-center">
                <div>
                  <p className="text-[14px] font-extrabold text-[var(--sane-green-deep)]">124K</p>
                  <p className="text-[8px] text-[var(--sane-text-light)]">Vues du profil</p>
                </div>
                <div>
                  <p className="text-[14px] font-extrabold text-[var(--sane-green-deep)]">2.8K</p>
                  <p className="text-[8px] text-[var(--sane-text-light)]">Candidats intéressés</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="flex items-center gap-1 text-[14px] font-extrabold text-[var(--sane-green-deep)]"><Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" /> 4.7</p>
                  <p className="text-[8px] text-[var(--sane-text-light)]">Note moyenne</p>
                </div>
              </div>
              <button type="button" onClick={() => setCompanyDraft(company)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--sane-green)] py-2 text-[11px] font-semibold text-[var(--sane-green)] hover:bg-[var(--sane-background)]">
                <Edit size={12} /> Modifier le profil de l'entreprise
              </button>
            </div>
          </div>

          {/* ═══════════ CANDIDATES TABLE + TOP OFFERS ═══════════ */}
          <div className="mb-6 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
            {/* Table */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5 min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[14px] font-bold text-[var(--sane-green-deep)]">Dernières candidatures</h3>
                </div>
                <Link href="/dashboard/admin/candidatures" className="text-[11px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={11} /></Link>
              </div>

              {/* Search + status filter + bulk actions */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div className="flex min-w-[160px] flex-1 items-center gap-2 rounded-lg border border-[var(--sane-border)] bg-[var(--sane-background)] px-3 py-1.5">
                  <SearchIcon size={13} className="shrink-0 text-[var(--sane-text-light)]" />
                  <input
                    type="search"
                    value={tbl.query}
                    onChange={(e) => tbl.setQuery(e.target.value)}
                    placeholder="Rechercher un candidat..."
                    aria-label="Rechercher un candidat"
                    className="min-w-0 flex-1 bg-transparent text-[11px] text-[var(--sane-green-deep)] outline-none placeholder:text-[var(--sane-text-light)]/60"
                  />
                </div>
                <select
                  value={tbl.filters["Statut"] ?? ""}
                  onChange={(e) => tbl.setFilter("Statut", e.target.value)}
                  aria-label="Filtrer par statut"
                  className="rounded-lg border border-[var(--sane-border)] bg-white px-2.5 py-1.5 text-[11px] text-[var(--sane-text-light)] outline-none"
                >
                  <option value="">Tous les statuts</option>
                  {tbl.options("Statut").map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {selectedRows.length > 0 && (
                  <div className="flex w-full flex-wrap items-center gap-2 rounded-lg bg-[var(--sane-green-light)] px-3 py-1.5 text-[11px] font-semibold text-[var(--sane-green)]">
                    {selectedRows.length} sélectionné{selectedRows.length > 1 ? "s" : ""}
                    <button
                      type="button"
                      onClick={() => {
                        selectedRows.forEach((row) => tbl.update(row._uid, { statut: "Présélectionné", statutColor: "#3b82f6" }));
                        tbl.notify(`${selectedRows.length} candidat(s) présélectionné(s)`);
                      }}
                      className="ml-auto flex items-center gap-1 hover:text-[var(--sane-orange)]"
                    >
                      <UserCheck size={12} /> Présélectionner
                    </button>
                    <button type="button" onClick={() => tbl.askDelete(selectedRows.map((row) => row._uid))} className="flex items-center gap-1 text-[#DC2626] hover:opacity-80">
                      <Trash2 size={12} /> Supprimer
                    </button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-[var(--sane-border)] text-[10px] font-semibold text-[var(--sane-text-light)]">
                    <th className="pb-2 pr-2 w-6"><input type="checkbox" aria-label="Tout sélectionner" checked={tbl.allSelected} onChange={tbl.toggleAll} className="h-3 w-3 accent-[var(--sane-green)]" /></th>
                    <th className="pb-2">Candidat</th>
                    <th className="pb-2">Poste</th>
                    <th className="pb-2">Date de candidature</th>
                    <th className="pb-2">Statut</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tbl.pageRows.map((c) => (
                    <tr key={c._uid} className="border-b border-[var(--sane-border)] last:border-0">
                      <td className="py-2.5 pr-2"><input type="checkbox" aria-label={`Sélectionner ${c.name}`} checked={tbl.selected.includes(c._uid)} onChange={() => tbl.toggle(c._uid)} className="h-3 w-3 accent-[var(--sane-green)]" /></td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <Image src={c.avatar} alt={c.name} width={28} height={28} className="rounded-full object-cover" />
                          <div>
                            <p className="text-[12px] font-semibold text-[var(--sane-green-deep)]">{c.name}</p>
                            <p className="text-[10px] text-[var(--sane-text-light)]">{c.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-[11px] text-[var(--sane-text-light)]">{c.poste}</td>
                      <td className="py-2.5 text-[11px] text-[var(--sane-text-light)]">{c.date}</td>
                      <td className="py-2.5">
                        <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold" style={{ borderColor: c.statutColor, color: c.statutColor }}>
                          {c.statut}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5 text-[var(--sane-text-light)]">
                          <button type="button" title="Voir le profil" aria-label="Voir le profil" onClick={() => tbl.openView(c)} className="hover:text-[var(--sane-green)]"><Eye size={14} /></button>
                          <button type="button" title="Envoyer un message" aria-label="Envoyer un message" onClick={() => tbl.notify(`Message envoyé à ${c.name}`)} className="hover:text-[var(--sane-green)]"><Mail size={14} /></button>
                          <RowMenu
                            size={14}
                            className="hover:text-[var(--sane-green)]"
                            items={[
                              { label: "Voir le profil", icon: Eye, onClick: () => tbl.openView(c) },
                              { label: "Modifier", icon: Pencil, onClick: () => tbl.openEdit(c) },
                              { label: "Présélectionner", icon: UserCheck, onClick: () => tbl.update(c._uid, { statut: "Présélectionné", statutColor: "#3b82f6" }, `${c.name} présélectionné(e)`) },
                              { label: "Planifier un entretien", icon: Calendar, onClick: () => scheduleInterview(c) },
                              { label: "Envoyer un message", icon: Mail, onClick: () => tbl.notify(`Message envoyé à ${c.name}`) },
                              { label: "Refuser la candidature", icon: XCircle, onClick: () => tbl.update(c._uid, { statut: "Refusé", statutColor: "#DC2626" }, `Candidature de ${c.name} refusée`) },
                              { label: "Supprimer", icon: Trash2, danger: true, dividerBefore: true, onClick: () => tbl.askDelete([c._uid]) },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tbl.pageRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[12px] text-[var(--sane-text-light)]">Aucune candidature trouvée.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
              <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="candidatures" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
            </div>

            {/* Top Offers */}
            <div className="rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Offres d'emploi les plus performantes</h3>
                </div>
                <Link href="/dashboard/admin/emploi" className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col gap-3">
                {topOffers.map((o) => (
                  <Link key={o.title} href="/dashboard/admin/emploi" className="flex items-center gap-3 rounded-lg bg-[var(--sane-background)] p-3 transition-shadow hover:shadow-md">
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--sane-green)] text-white">
                      <span className="text-[14px] font-extrabold leading-none">{o.count}</span>
                      <span className="text-[6px]">candidatures</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-[var(--sane-green-deep)]">{o.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[var(--sane-text-light)]">
                        <span className="flex items-center gap-0.5"><Eye size={9} /> {o.views}</span>
                        <span className="flex items-center gap-0.5"><Clock size={9} /> {o.time}</span>
                      </div>
                    </div>
                    <ChevronDown size={14} className="rotate-[-90deg] text-[var(--sane-text-light)]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════ BOTTOM ROW ═══════════ */}
          <div className="relative grid grid-cols-1 xl:grid-cols-[1fr_1fr_300px] gap-4">
            {/* Italic text */}
            <p className="absolute -left-2 -bottom-2 text-lg italic text-[var(--sane-green)]/20 z-0" style={{ fontFamily: "serif" }}>
              Des talents<br/>pour un Niger<br/>plus fort
            </p>

            {/* Prochains entretiens */}
            <div className="relative z-10 rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Prochains entretiens</h3>
                </div>
                <button type="button" onClick={() => soon("Entretiens")} className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={10} /></button>
              </div>
              <div className="flex flex-col gap-3">
                {interviewList.slice(0, 4).map((itv) => (
                  <div key={`${itv.title}-${itv.person}-${itv.day}`} className="flex items-start gap-3">
                    <div className="flex shrink-0 flex-col items-center">
                      <span className="text-[16px] font-extrabold leading-none text-[var(--sane-orange)]">{itv.day}</span>
                      <span className="text-[9px] font-semibold text-[var(--sane-orange)]">{itv.month}</span>
                    </div>
                    <div className="shrink-0" style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, borderRadius: "50%", overflow: "hidden", position: "relative" }}>
                      <Image src={itv.avatar} alt={itv.person} fill sizes="32px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-[var(--sane-green-deep)]">{itv.title}</p>
                      <div className="flex items-center gap-3 text-[10px] text-[var(--sane-text-light)]">
                        <span className="flex items-center gap-0.5"><MapPin size={9} /> {itv.person}</span>
                        <span className="flex items-center gap-0.5"><Clock size={9} /> {itv.time}</span>
                      </div>
                    </div>
                    {itv.type === "video" ? (
                      <Video size={18} className="text-[#3b82f6] mt-1" />
                    ) : (
                      <MapPin size={18} className="text-[#ef4444] mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Messages récents */}
            <div className="relative z-10 rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Messages récents</h3>
                </div>
                <button type="button" onClick={() => setReadMessages(messages.map((m) => m.name))} className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Tout marquer comme lu <ArrowRight size={10} /></button>
              </div>
              <div className="flex flex-col gap-4">
                {messages.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => (readMessages.includes(m.name) ? soon("Messages") : setReadMessages((l) => [...l, m.name]))}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <Image src={m.avatar} alt={m.name} width={36} height={36} className="rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-[var(--sane-green-deep)]">{m.name}</p>
                      <p className="text-[10px] text-[var(--sane-text-light)] truncate">{m.preview}</p>
                      <p className="text-[9px] text-[var(--sane-text-light)]/60 mt-0.5">{m.time}</p>
                    </div>
                    {!readMessages.includes(m.name) && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--sane-green)]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications récentes */}
            <div className="relative z-10 rounded-xl border border-[var(--sane-border)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[13px] font-bold text-[var(--sane-green-deep)]">Notifications récentes</h3>
                </div>
                <Link href="/dashboard/admin/notifications" className="text-[10px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)] flex items-center gap-1">Voir tout <ArrowRight size={10} /></Link>
              </div>
              <div className="flex flex-col gap-3">
                {notifications.map((n) => (
                  <button
                    key={n.title}
                    type="button"
                    onClick={() => setReadNotifs((l) => (l.includes(n.title) ? l : [...l, n.title]))}
                    className={`flex w-full items-start gap-2.5 text-left transition-opacity ${readNotifs.includes(n.title) ? "opacity-50" : ""}`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: n.iconBg }}>
                      {n.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[var(--sane-green-deep)]">{n.title}</p>
                      <p className="text-[10px] text-[var(--sane-text-light)] truncate">{n.desc}</p>
                      <p className="text-[9px] text-[var(--sane-orange)] mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <TableDialogs table={tbl} entity="candidature" />

      {companyDraft && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onMouseDown={() => setCompanyDraft(null)}>
          <form
            onMouseDown={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!companyDraft.name.trim()) return;
              setCompany(companyDraft);
              setCompanyDraft(null);
              tbl.notify("Profil de l'entreprise mis à jour");
            }}
            className="flex w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--sane-border)] px-5 py-4">
              <h3 className="text-[15px] font-bold text-[var(--sane-green-deep)]">Profil de l&apos;entreprise</h3>
              <button type="button" aria-label="Fermer" onClick={() => setCompanyDraft(null)} className="rounded-full p-1 text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]"><X size={16} /></button>
            </div>
            <div className="grid gap-4 px-5 py-4">
              {([
                ["name", "Nom de l'entreprise"],
                ["secteur", "Secteur d'activité"],
                ["ville", "Localisation"],
                ["site", "Site web"],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-semibold text-[var(--sane-green-deep)]">{label}</span>
                  <input
                    value={companyDraft[key]}
                    onChange={(e) => setCompanyDraft({ ...companyDraft, [key]: e.target.value })}
                    required={key === "name"}
                    className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--sane-border)] px-5 py-3">
              <button type="button" onClick={() => setCompanyDraft(null)} className="rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[12px] font-semibold text-[var(--sane-text-light)] hover:bg-[var(--sane-background)]">Annuler</button>
              <button type="submit" className="rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[var(--sane-orange-dark)]">Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
