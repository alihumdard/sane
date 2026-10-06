"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Share2, ChevronRight, Search,
  RefreshCw, Plus, Eye, Pencil, Trash2, MoreVertical, Star,
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
const sidebarItems = adminNav("Intervenants", 0);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "46", label: "Total intervenants", trend: "+18%", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "12", label: "Intervenants internationaux", trend: "+33%", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm-1 14v-4H7l5-8v4h4l-5 8z"/></svg>,
    value: "28", label: "Intervenants nationaux", trend: "+12%", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18" stroke="white" strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    value: "36", label: "Sessions animées", trend: "+25%", bg: "#F0E8F5", color: "#6B21A8",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>,
    value: "4.8", label: "Note moyenne", trend: "+8%", bg: "#FFFBEB", color: "#f59e0b",
  },
];

/* ─── Table data ─── */
const catColors: Record<string, string> = {
  "Leadership":     "bg-[#DBEAFE] text-[#1d4ed8]",
  "Innovation":     "bg-[#EDE9FE] text-[#6d28d9]",
  "Entrepreneuriat":"bg-[#FEF3C7] text-[#92400e]",
  "Éducation":      "bg-[#D1FAE5] text-[#065f46]",
  "Développement":  "bg-[#CCFBF1] text-[#0f766e]",
  "Tech & Digital": "bg-[#CFFAFE] text-[#0e7490]",
  "Jeunesse":       "bg-[#FCE7F3] text-[#9d174d]",
  "Inclusion":      "bg-[#FEF9C3] text-[#854d0e]",
  "Emploi":         "bg-[#DCFCE7] text-[#166534]",
  "Formation":      "bg-[#E0F2FE] text-[#0369a1]",
};

const intervenants = [
  { photo: "https://randomuser.me/api/portraits/women/44.jpg", name: "Dr. Aissata Ibrahim",  code: "#SPK001", fonction: "Directrice des Ressources Humaines", entreprise: "Banque Mondiale", cat: "Leadership",     pays: "🇳🇪 Niger",       sessions: 4, statut: "Confirmé", note: 4.9 },
  { photo: "https://randomuser.me/api/portraits/men/32.jpg",   name: "Jean-Marc Lefèvre",    code: "#SPK002", fonction: "Expert en Innovation",              entreprise: "AFD",            cat: "Innovation",     pays: "🇫🇷 France",      sessions: 3, statut: "Confirmé", note: 4.8 },
  { photo: "https://randomuser.me/api/portraits/women/65.jpg", name: "Fatoumata Diallo",     code: "#SPK003", fonction: "CEO",                               entreprise: "Startup Africa", cat: "Entrepreneuriat",pays: "🇸🇳 Sénégal",     sessions: 5, statut: "Confirmé", note: 4.7 },
  { photo: "https://randomuser.me/api/portraits/men/71.jpg",   name: "Prof. Mamadou Kone",   code: "#SPK004", fonction: "Professeur d'Université",           entreprise: "Univ. de Niamey",cat: "Éducation",     pays: "🇳🇪 Niger",       sessions: 6, statut: "Confirmé", note: 4.9 },
  { photo: "https://randomuser.me/api/portraits/women/22.jpg", name: "Sarah Johnson",        code: "#SPK005", fonction: "Consultante en Développement",      entreprise: "PNUD",           cat: "Développement",  pays: "🇺🇸 États-Unis",  sessions: 2, statut: "En attente", note: 4.6 },
  { photo: "https://randomuser.me/api/portraits/men/55.jpg",   name: "Alioune Fall",         code: "#SPK006", fonction: "Fondateur",                         entreprise: "Tech4Africa",    cat: "Tech & Digital", pays: "🇸🇳 Sénégal",     sessions: 4, statut: "Confirmé", note: 4.8 },
  { photo: "https://randomuser.me/api/portraits/women/33.jpg", name: "Marie Dubois",         code: "#SPK007", fonction: "Directrice des Programmes",         entreprise: "UNICEF",         cat: "Jeunesse",       pays: "🇫🇷 France",      sessions: 3, statut: "Confirmé", note: 4.7 },
  { photo: "https://randomuser.me/api/portraits/men/41.jpg",   name: "Omar Saidou",          code: "#SPK008", fonction: "Entrepreneur Social",               entreprise: "Impact Niger",   cat: "Inclusion",      pays: "🇳🇪 Niger",       sessions: 2, statut: "En attente", note: 4.5 },
  { photo: "https://randomuser.me/api/portraits/women/57.jpg", name: "Dr. Amina Hassan",     code: "#SPK009", fonction: "Spécialiste en Compétences",        entreprise: "BIT",            cat: "Emploi",         pays: "🇨🇭 Suisse",      sessions: 3, statut: "Confirmé", note: 4.9 },
  { photo: "https://randomuser.me/api/portraits/men/28.jpg",   name: "Carlos Mendes",        code: "#SPK010", fonction: "Directeur Régional",                entreprise: "GIZ",            cat: "Formation",      pays: "🇩🇪 Allemagne",   sessions: 2, statut: "Confirmé", note: 4.6 },
];

/* ─── Right sidebar data ─── */
const donutData = [
  { label: "Leadership",     pct: 20, color: "#3B82F6" },
  { label: "Innovation",     pct: 18, color: "#8B5CF6" },
  { label: "Entrepreneuriat",pct: 15, color: "#F59E0B" },
  { label: "Éducation",      pct: 12, color: "#10B981" },
  { label: "Développement",  pct: 12, color: "#14B8A6" },
  { label: "Tech & Digital", pct: 10, color: "#06B6D4" },
  { label: "Jeunesse",       pct:  8, color: "#EC4899" },
  { label: "Autres",         pct:  7, color: "#94A3B8" },
];

const topIntervenants = [
  { rank: 1, rankColor: "#10632D", photo: "https://randomuser.me/api/portraits/women/44.jpg", name: "Dr. Aissata Ibrahim",  note: "4.9", sessions: "4 sessions" },
  { rank: 2, rankColor: "#6B21A8", photo: "https://randomuser.me/api/portraits/men/71.jpg",   name: "Prof. Mamadou Kone",   note: "4.9", sessions: "6 sessions" },
  { rank: 3, rankColor: "#0891b2", photo: "https://randomuser.me/api/portraits/women/57.jpg", name: "Dr. Amina Hassan",     note: "4.9", sessions: "3 sessions" },
  { rank: 4, rankColor: "#E57617", photo: "https://randomuser.me/api/portraits/men/32.jpg",   name: "Jean-Marc Lefèvre",    note: "4.8", sessions: "3 sessions" },
  { rank: 5, rankColor: "#ec4899", photo: "https://randomuser.me/api/portraits/men/55.jpg",   name: "Alioune Fall",         note: "4.8", sessions: "4 sessions" },
];

const prochaines = [
  { day: "12", month: "Mai", color: "#10632D", name: "Dr. Aissata Ibrahim",  desc: "Leadership des jeunes",    time: "14:00 - 15:30", salle: "Salle A" },
  { day: "15", month: "Mai", color: "#2563EB", name: "Jean-Marc Lefèvre",    desc: "Innovation et emploi",     time: "10:00 - 11:30", salle: "Salle B" },
  { day: "18", month: "Mai", color: "#E57617", name: "Fatoumata Diallo",     desc: "Entrepreneuriat féminin",  time: "16:00 - 17:30", salle: "Salle C" },
];

/* ─── Donut chart via conic-gradient ─── */
function DonutChart() {
  let cumulative = 0;
  const segments = donutData.map(d => {
    const start = cumulative;
    cumulative += d.pct;
    return { ...d, start, end: cumulative };
  });
  const gradient = segments.map(s => `${s.color} ${s.start * 3.6}deg ${s.end * 3.6}deg`).join(", ");

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: 90, height: 90 }}>
        <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${gradient})` }} />
        <div className="absolute inset-[14px] rounded-full bg-white flex flex-col items-center justify-center">
          <span className="text-[14px] font-extrabold text-[var(--sane-green-deep)] leading-none">46</span>
          <span className="text-[7px] text-[var(--sane-text-light)]">Intervenants</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {donutData.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[9px] text-[var(--sane-text-light)] flex-1">{d.label}</span>
            <span className="text-[9px] font-semibold text-[var(--sane-green-deep)]">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function IntervenantsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(intervenants, { filterKeys: {"Catégorie":"cat","Statut":"statut"} });

  return (
    <div className="flex h-screen bg-[var(--sane-background)] overflow-hidden">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher un intervenant, un domaine, une entreprise..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-1 text-[11px] text-[var(--sane-text-light)]">
            <span className="cursor-pointer hover:text-[var(--sane-green)]">Accueil</span>
            <ChevronRight size={12} />
            <span className="cursor-pointer hover:text-[var(--sane-green)]">Intervenants</span>
            <ChevronRight size={12} />
            <span className="font-medium text-[var(--sane-green-deep)]">Tous les intervenants</span>
          </div>

          {/* Welcome Banner */}
          <div className="relative mb-5 h-[110px] sm:h-[150px] overflow-hidden rounded-2xl">
            <Image src="/sane_deal.png" alt="Banner" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
            <div className="absolute inset-0 flex items-center px-4 sm:px-8">
              <div className="max-w-[60%] sm:max-w-[50%]">
                <h1 className="text-[16px] sm:text-[22px] font-extrabold text-[var(--sane-green-deep)] leading-tight">Gestion des intervenants</h1>
                <p className="mt-1 text-[10px] sm:text-[11px] text-[var(--sane-text-light)] leading-relaxed hidden sm:block">
                  Gérez tous les intervenants du SANEM. Ajoutez de nouveaux intervenants,<br/>
                  assignez-les aux sessions et suivez leur participation.
                </p>
                <button type="button" onClick={tbl.openAdd} className="mt-2 flex items-center gap-1 rounded-lg bg-[var(--sane-orange)] px-3 py-1.5 text-[10px] font-bold text-white sm:hidden">
                  <Plus size={11} /> Ajouter
                </button>
              </div>
              <div className="absolute right-4 sm:right-8 top-3 sm:top-4 flex flex-col items-end gap-1 hidden sm:flex">
                <button type="button" onClick={tbl.openAdd} className="flex items-center gap-2 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#c45e0e]">
                  <Plus size={13} /> Ajouter un intervenant
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mb-5 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => <StatsCard key={i} {...s} />)}
          </div>

          {/* Main + Right Sidebar */}
          <div className="grid gap-4 grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_290px]">
            <div className="flex flex-col gap-3 min-w-0">

              {/* Filter Bar */}
              <FilterBar searchPlaceholder="Rechercher un intervenant..." filters={["Catégorie", "Statut", "Pays"]} table={tbl} />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                      <th className="px-3 py-2 w-8"><input type="checkbox" className="accent-[var(--sane-green)]" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[var(--sane-text-light)]">Intervenant</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[var(--sane-text-light)]">Fonction / Entreprise</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[var(--sane-text-light)]">Catégorie</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[var(--sane-text-light)]">Pays</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[var(--sane-text-light)]">Sessions</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[var(--sane-text-light)]">Statut</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[var(--sane-text-light)]">Note</th>
                      <th className="px-2 py-2 text-[10px] font-semibold text-[var(--sane-text-light)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.pageRows.map((r, i) => (
                      <tr key={i} className="border-b border-[var(--sane-border)]/50 hover:bg-[var(--sane-background)]/50">
                        <td className="px-3 py-2"><input type="checkbox" className="accent-[var(--sane-green)]" checked={tbl.selected.includes(r._uid)} onChange={() => tbl.toggle(r._uid)} /></td>
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full shrink-0 border border-[var(--sane-border)]">
                              <Image src={r.photo} alt={r.name} width={32} height={32} className="object-cover" />
                            </div>
                            <div>
                              <p className="whitespace-nowrap text-[12px] font-semibold text-[var(--sane-green-deep)]">{r.name}</p>
                              <p className="text-[9px] text-[var(--sane-text-light)]">{r.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1.5">
                          <p className="min-w-[200px] text-[12px] font-medium text-[var(--sane-green-deep)]">{r.fonction}</p>
                          <p className="text-[9px] text-[var(--sane-text-light)]">{r.entreprise}</p>
                        </td>
                        <td className="px-2 py-1.5">
                          <span className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold ${catColors[r.cat] || "bg-gray-100 text-gray-600"}`}>{r.cat}</span>
                        </td>
                        <td className="px-2 py-1.5">
                          <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-[var(--sane-green-deep)]">
                            <span className="text-[16px] leading-none">{r.pays.split(" ")[0]}</span>
                            <span>{r.pays.split(" ").slice(1).join(" ")}</span>
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-center text-[11px] text-[var(--sane-green-deep)]">{r.sessions}</td>
                        <td className="px-2 py-1.5">
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${r.statut === "Confirmé" ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]" : "bg-[var(--sane-orange-light)] text-[var(--sane-orange)]"}`}>{r.statut}</span>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-0.5">
                            <Star size={11} fill="#f59e0b" className="text-[#f59e0b]" />
                            <span className="text-[11px] font-semibold text-[var(--sane-green-deep)]">{r.note}</span>
                          </div>
                        </td>
                        <td className="px-2 py-1.5">
                          <RowActions table={tbl} row={r} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="intervenants" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 2xl:flex 2xl:flex-col gap-4 min-w-0">
              {/* Répartition par catégorie */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[12px] font-bold text-[var(--sane-green-deep)]">Répartition par catégorie</h3>
                </div>
                <DonutChart />
              </div>

              {/* Top intervenants */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[var(--sane-orange)]" />
                    <h3 className="text-[12px] font-bold text-[var(--sane-green-deep)]">Top intervenants</h3>
                  </div>
                  <button className="text-[9px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]">Voir tout</button>
                </div>
                <div className="flex flex-col gap-2">
                  {topIntervenants.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold shrink-0" style={{ backgroundColor: `${t.rankColor}18`, color: t.rankColor }}>{t.rank}</span>
                      <div className="h-7 w-7 overflow-hidden rounded-full shrink-0 border border-[var(--sane-border)]">
                        <Image src={t.photo} alt={t.name} width={28} height={28} className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-[var(--sane-green-deep)] truncate">{t.name}</p>
                        <div className="flex items-center gap-1">
                          <Star size={9} fill="#f59e0b" className="text-[#f59e0b]" />
                          <span className="text-[9px] text-[var(--sane-text-light)]">{t.note} · {t.sessions}</span>
                        </div>
                      </div>
                      <ChevronRight size={12} className="text-[var(--sane-text-light)] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prochaines interventions */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[var(--sane-orange)]" />
                    <h3 className="text-[12px] font-bold text-[var(--sane-green-deep)]">Prochaines interventions</h3>
                  </div>
                  <button className="text-[9px] font-semibold text-[var(--sane-green)] hover:text-[var(--sane-orange)]">Voir tout</button>
                </div>
                <div className="flex flex-col gap-3">
                  {prochaines.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-full" style={{ backgroundColor: `${p.color}15` }}>
                        <span className="text-[12px] font-extrabold leading-none" style={{ color: p.color }}>{p.day}</span>
                        <span className="text-[7px] font-semibold" style={{ color: p.color }}>{p.month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-[var(--sane-green-deep)] truncate">{p.name}</p>
                        <p className="text-[9px] text-[var(--sane-text-light)] truncate">{p.desc}</p>
                        <p className="text-[8px] text-[var(--sane-text-light)]/70">{p.time} · {p.salle}</p>
                      </div>
                      <ChevronRight size={12} className="text-[var(--sane-text-light)] shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <TableDialogs table={tbl} entity="intervenant" />
    </div>
  );
}
