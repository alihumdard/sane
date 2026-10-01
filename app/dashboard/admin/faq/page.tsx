"use client";

import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Search, Eye, Pencil, Copy, Trash2, MoreVertical,
  MessageSquare, FolderOpen, BarChart3, Settings, FileText, Share2, Star,
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
  { icon: <Calendar size={18} />, label: "Événements", chevron: true },
  { icon: <Mic size={18} />, label: "Intervenants", chevron: true },
  { icon: <Handshake size={18} />, label: "Partenaires", chevron: true },
  { icon: <Newspaper size={18} />, label: "Presse", chevron: true },
  {
    icon: <HelpCircle size={18} />, label: "FAQ", active: true, chevron: true, expanded: true,
    subItems: ["Toutes les questions", "Ajouter une question", "Catégories", "Pages FAQ", "Statistiques"],
    activeSubIndex: 0,
  },
  { icon: <FileText size={18} />, label: "Contenus", chevron: true },
  { icon: <Share2 size={18} />, label: "Communication", chevron: true },
  { icon: <BarChart3 size={18} />, label: "Rapports", chevron: true },
  { icon: <Settings size={18} />, label: "Paramètres", chevron: true },
];

/* ─── Stats ─── */
const statsData = [
  {
    icon: <MessageSquare size={22} />,
    value: "48", label: "Questions totales", trend: "+20%", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <FolderOpen size={22} />,
    value: "8", label: "Catégories", trend: "+14%", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <Eye size={22} />,
    value: "12.4K", label: "Vues totales", trend: "+35%", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <Users size={22} />,
    value: "3.8K", label: "Utilisateurs uniques", trend: "+28%", bg: "#F3E8FF", color: "#7C3AED",
  },
  {
    icon: <Star size={22} />,
    value: "4.7", label: "Note moyenne", trend: "+12%", bg: "#FFFBE8", color: "#D97706",
  },
];

/* ─── Table Data ─── */
const questions = [
  { question: "Comment puis-je m'inscrire au Salon National de l'Emploi ?", categorie: "Inscription", catColor: "#10632D", vues: 2540, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "12 Mars 2024" },
  { question: "La participation au SANE est-elle gratuite ?", categorie: "Général", catColor: "#61756B", vues: 1980, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "10 Mars 2024" },
  { question: "Quels sont les documents nécessaires ?", categorie: "Documents", catColor: "#7C3AED", vues: 1760, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "08 Mars 2024" },
  { question: "Comment postuler aux offres d'emploi ?", categorie: "Emploi", catColor: "#E57617", vues: 1520, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "05 Mars 2024" },
  { question: "Comment devenir exposant ou partenaire ?", categorie: "Partenariat", catColor: "#2563EB", vues: 1340, statut: "Brouillon", statutColor: "#D97706", statutBg: "#FFFBE8", date: "02 Mars 2024" },
  { question: "Y a-t-il des formations pendant le salon ?", categorie: "Formation", catColor: "#0891B2", vues: 1210, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "28 Fév 2024" },
  { question: "Comment accéder aux conférences ?", categorie: "Événements", catColor: "#DB2777", vues: 1090, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "25 Fév 2024" },
  { question: "Le salon est-il ouvert aux étudiants ?", categorie: "Étudiants", catColor: "#059669", vues: 980, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "22 Fév 2024" },
  { question: "Où se déroule le SANE 2024 ?", categorie: "Lieu", catColor: "#7C3AED", vues: 860, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "20 Fév 2024" },
  { question: "Comment contacter l'équipe organisatrice ?", categorie: "Contact", catColor: "#E57617", vues: 740, statut: "Publié", statutColor: "#10632D", statutBg: "#E8F5ED", date: "18 Fév 2024" },
];

/* ─── Donut chart segments ─── */
const categories = [
  { label: "Inscription", pct: 22, color: "#10632D" },
  { label: "Emploi", pct: 18, color: "#E57617" },
  { label: "Formation", pct: 15, color: "#0891B2" },
  { label: "Partenariat", pct: 12, color: "#2563EB" },
  { label: "Événements", pct: 10, color: "#DB2777" },
  { label: "Documents", pct: 8, color: "#7C3AED" },
  { label: "Général", pct: 8, color: "#61756B" },
  { label: "Autres", pct: 7, color: "#94A3B8" },
];

function buildConic(segs: { pct: number; color: string }[]) {
  let acc = 0;
  return segs.map(s => {
    const start = acc;
    acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  }).join(", ");
}

/* ─── Top questions ─── */
const topQuestions = [
  { rank: 1, titre: "Comment puis-je m'inscrire au SANE ?", vues: "2,540 vues" },
  { rank: 2, titre: "La participation est-elle gratuite ?", vues: "1,980 vues" },
  { rank: 3, titre: "Quels sont les documents nécessaires ?", vues: "1,760 vues" },
  { rank: 4, titre: "Comment postuler aux offres d'emploi ?", vues: "1,520 vues" },
  { rank: 5, titre: "Comment devenir partenaire ?", vues: "1,340 vues" },
];

/* ─── Questions récentes ─── */
const questionsRecentes = [
  { day: "12", month: "Mar", titre: "Comment s'inscrire au SANE ?", statut: "Publié" },
  { day: "10", month: "Mar", titre: "La participation est-elle gratuite ?", statut: "Publié" },
  { day: "08", month: "Mar", titre: "Quels sont les documents ?", statut: "Publié" },
  { day: "05", month: "Mar", titre: "Comment postuler aux offres ?", statut: "Publié" },
  { day: "02", month: "Mar", titre: "Devenir exposant ou partenaire ?", statut: "Brouillon" },
];

const rankColors = ["#E57617", "#10632D", "#2563EB", "#DB2777", "#7C3AED"];

export default function FaqPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          searchPlaceholder="Rechercher une question, une catégorie..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Hero Banner - dark variant with breadcrumb inside */}
          <div className="relative mb-4 h-[170px] overflow-hidden rounded-2xl bg-[#0a2e16]">
            <div className="absolute right-0 top-0 h-full w-[60%]">
              <Image src="https://images.unsplash.com/photo-1613005341945-35e159e522f1?w=800&h=400&fit=crop&crop=faces&facepad=3" alt="faq" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e16] via-[#0a2e16]/30 to-transparent" />
            </div>
            <div className="absolute right-32 top-1/2 -translate-y-1/2 opacity-30">
              <svg width="90" height="90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="white" opacity="0.15"/>
                <circle cx="50" cy="50" r="45" stroke="#E57617" strokeWidth="2.5" fill="none" opacity="0.4" strokeDasharray="6 3"/>
                <text x="50" y="46" textAnchor="middle" fill="white" fontSize="12" fontWeight="800">SANE</text>
                <text x="50" y="58" textAnchor="middle" fill="white" fontSize="5" fontWeight="600">SALON NATIONAL DE L&apos;EMPLOI</text>
              </svg>
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-right">
              <p className="text-[22px] italic font-bold text-white leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Un Niger<br />de Talents
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] text-white/70">
                <span>Accueil</span>
                <span>&rsaquo;</span>
                <span>FAQ</span>
                <span>&rsaquo;</span>
                <span className="font-semibold text-white">Toutes les questions</span>
              </div>
              <h1 className="text-[26px] font-extrabold text-white leading-tight">Gestion des FAQ</h1>
              <p className="mt-1 max-w-[420px] text-[11px] text-white/80 leading-relaxed">
                Gérez toutes les questions fréquentes du SANE. Organisez-les par catégories,<br />
                mettez à jour les réponses et suivez les questions les plus consultées.
              </p>
            </div>
            <button className="absolute right-10 top-6 flex items-center gap-1.5 rounded-lg bg-[#E57617] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter une question
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} bg={s.bg} color={s.color} />
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
                  <input type="text" placeholder="Rechercher une question..." className="w-full bg-transparent text-[11px] text-[#0a2e16] placeholder:text-[#61756B]/60 outline-none" />
                </div>
                {["Catégorie", "Statut", "Popularité"].map(f => (
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
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Question</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Catégorie</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">
                        <span className="flex items-center gap-0.5">Vues <svg width="8" height="8" viewBox="0 0 10 14" fill="#61756B"><path d="M5 0L9 5H1L5 0zm0 14L1 9h8L5 14z"/></svg></span>
                      </th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Statut</th>
                      <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Dernière mise à jour</th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, i) => (
                      <tr key={i} className="border-b border-[#DDE8E0] last:border-0 hover:bg-[#F5F9F6]/50">
                        <td className="px-3 py-2.5"><input type="checkbox" className="h-3 w-3 rounded" /></td>
                        <td className="px-2 py-2.5 max-w-[280px]">
                          <p className="text-[11px] font-semibold text-[#0a2e16] leading-tight">{q.question}</p>
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${q.catColor}18`, color: q.catColor }}>
                            {q.categorie}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-1">
                            <Eye size={12} className="text-[#61756B]" />
                            <span className="text-[11px] font-medium text-[#0a2e16]">{q.vues.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: q.statutBg, color: q.statutColor }}>
                            {q.statut}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="text-[10px] text-[#61756B]">{q.date}</span>
                        </td>
                        <td className="px-2 py-2.5">
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

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-[#DDE8E0] px-4 py-2.5">
                  <span className="text-[10px] text-[#61756B]">Affichage de 1 à 10 sur 48 questions</span>
                  <div className="flex items-center gap-2">
                    <select className="rounded border border-[#DDE8E0] px-1.5 py-0.5 text-[10px] text-[#0a2e16] outline-none">
                      <option>10 par page</option>
                    </select>
                    <div className="flex items-center gap-1">
                      <button className="rounded px-1.5 py-0.5 text-[10px] text-[#61756B]">&lsaquo;</button>
                      {[1, 2, 3, 4, 5].map(p => (
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
              {/* Donut chart */}
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
                        <span className="text-[14px] font-extrabold text-[#0a2e16] leading-none">48</span>
                        <span className="text-[7px] text-[#61756B]">Questions</span>
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

              {/* Top questions (vues) */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#E57617]" />
                    <span className="text-[11px] font-bold text-[#0a2e16]">Top questions (vues)</span>
                  </div>
                  <button className="shrink-0 ml-1 text-[9px] font-semibold text-[#E57617]">Voir tout</button>
                </div>
                <div className="flex flex-col gap-2">
                  {topQuestions.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: `${rankColors[i]}18`, color: rankColors[i] }}>
                        {t.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight truncate">{t.titre}</p>
                        <p className="text-[9px] text-[#61756B]">{t.vues}</p>
                      </div>
                      <svg className="shrink-0" width="10" height="10" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="#61756B" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions récentes */}
              <div className="flex-1 rounded-xl border border-[#DDE8E0] bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#E57617]" />
                    <span className="text-[11px] font-bold text-[#0a2e16]">Questions récentes</span>
                  </div>
                  <button className="shrink-0 ml-1 text-[9px] font-semibold text-[#E57617]">Voir tout</button>
                </div>
                <div className="flex flex-col gap-2">
                  {questionsRecentes.map((q, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex h-9 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-[#FFF3E8]">
                        <span className="text-[12px] font-extrabold text-[#E57617] leading-none">{q.day}</span>
                        <span className="text-[7px] font-semibold text-[#E57617]">{q.month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-[#0a2e16] leading-tight truncate">{q.titre}</p>
                        <span className="text-[9px] text-[#61756B]">{q.statut}</span>
                      </div>
                      <svg className="shrink-0 mt-1" width="10" height="10" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="#61756B" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
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
