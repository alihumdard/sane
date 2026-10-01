"use client";

import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Share2, Search, Eye, Pencil, Trash2, MoreVertical,
} from "lucide-react";

import DashboardSidebar, { type SidebarItem } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatsCard from "@/components/dashboard/StatsCard";

/* ─── Sidebar ─── */
const sidebarItems: SidebarItem[] = [
  { icon: <Home size={18} />, label: "Tableau de bord" },
  {
    icon: <Users size={18} />, label: "Utilisateurs", active: true, chevron: true, expanded: true,
    subItems: ["Tous les utilisateurs", "Participants", "Entreprises", "Recruteurs", "Organisateurs", "Administrateurs", "Rôles et permissions"],
    activeSubIndex: 0,
  },
  { icon: <Briefcase size={18} />, label: "Emploi", chevron: true },
  { icon: <BookOpen size={18} />, label: "Formations", chevron: true },
  { icon: <Calendar size={18} />, label: "Événements", chevron: true },
  { icon: <Mic size={18} />, label: "Intervenants", chevron: true },
  { icon: <Handshake size={18} />, label: "Partenaires", chevron: true },
  { icon: <Newspaper size={18} />, label: "Presse", chevron: true },
  { icon: <HelpCircle size={18} />, label: "FAQ", chevron: true },
  { icon: <Bell size={18} />, label: "Notifications", chevron: true },
  { icon: <BarChart3 size={18} />, label: "Rapports", chevron: true },
  { icon: <Settings size={18} />, label: "Paramètres", chevron: true },
  { icon: <FileText size={18} />, label: "Contenus", chevron: true },
  { icon: <Share2 size={18} />, label: "Communication", chevron: true },
];

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2c0-2.2 3.6-4 8-4s8 1.8 8 4v2H4z"/></svg>,
    value: "1,248", label: "Total utilisateurs", trend: "+12%", bg: "#E8F5ED", color: "#10632D",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "856", label: "Participants", trend: "+18%", bg: "#FFF3E8", color: "#E57617",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
    value: "214", label: "Entreprises", trend: "+8%", bg: "#E0F0FF", color: "#2563EB",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.49 0 12.36 0c-1.7 0-3.21.94-4.1 2.35L12 6H8l-1.5-2.62C5.62 2.18 4.2 2 3 2H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>,
    value: "156", label: "Recruteurs", trend: "+10%", bg: "#F3E8FF", color: "#7C3AED",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>,
    value: "22", label: "Organisateurs", trend: "+4%", bg: "#E8F5ED", color: "#059669",
  },
];

/* ─── Role colors ─── */
const roleStyle: Record<string, { bg: string; color: string }> = {
  "Participant":    { bg: "#E8F5ED", color: "#10632D" },
  "Recruteur":      { bg: "#F3E8FF", color: "#7C3AED" },
  "Entreprise":     { bg: "#E0F0FF", color: "#2563EB" },
  "Organisateur":   { bg: "#CCFBF1", color: "#0D9488" },
  "Administrateur": { bg: "#FFF3E8", color: "#E57617" },
};

/* ─── Statut colors ─── */
const statutStyle: Record<string, { bg: string; color: string }> = {
  "Actif":      { bg: "#E8F5ED", color: "#10632D" },
  "En attente": { bg: "#FFF3E8", color: "#E57617" },
  "Inactif":    { bg: "#FEE2E2", color: "#DC2626" },
};

/* ─── Users data ─── */
const utilisateurs = [
  { id: "#USR001", nom: "Aicha Mohamed",   photo: "https://randomuser.me/api/portraits/women/11.jpg", role: "Participant",    org: "—",             email: "aicha@example.com",       tel: "+227 96 12 34 56", statut: "Actif",      date: "12 Mars 2024" },
  { id: "#USR002", nom: "Omar Issa",        photo: "https://randomuser.me/api/portraits/men/22.jpg",   role: "Recruteur",      org: "Enabel Niger",  email: "omar@enabel.ne",          tel: "+227 90 11 22 33", statut: "Actif",      date: "10 Mars 2024" },
  { id: "#USR003", nom: "Fatima Bello",     photo: "https://randomuser.me/api/portraits/women/33.jpg", role: "Participant",    org: "—",             email: "fatima@example.com",      tel: "+227 97 45 67 89", statut: "En attente", date: "08 Mars 2024" },
  { id: "#USR004", nom: "Moussa Diallo",    photo: "https://randomuser.me/api/portraits/men/44.jpg",   role: "Entreprise",     org: "GIZ Niger",     email: "moussa@giz.ne",           tel: "+227 98 76 54 32", statut: "Actif",      date: "05 Mars 2024" },
  { id: "#USR005", nom: "Khadija Ali",      photo: "https://randomuser.me/api/portraits/women/55.jpg", role: "Organisateur",   org: "SANE",          email: "khadija@sane.ne",         tel: "+227 92 33 44 55", statut: "Actif",      date: "02 Mars 2024" },
  { id: "#USR006", nom: "Ibrahim Toure",    photo: "https://randomuser.me/api/portraits/men/66.jpg",   role: "Participant",    org: "—",             email: "ibrahim@example.com",     tel: "+227 91 22 33 44", statut: "Inactif",    date: "28 Février 2024" },
  { id: "#USR007", nom: "Nadia Saidou",     photo: "https://randomuser.me/api/portraits/women/77.jpg", role: "Recruteur",      org: "PNUD Niger",    email: "nadia@pnud.ne",           tel: "+227 93 55 66 77", statut: "Actif",      date: "25 Février 2024" },
  { id: "#USR008", nom: "Ahmed Mahamane",   photo: "https://randomuser.me/api/portraits/men/88.jpg",   role: "Administrateur", org: "SANE",          email: "ahmed@sane.ne",           tel: "+227 90 88 77 66", statut: "Actif",      date: "20 Février 2024" },
  { id: "#USR009", nom: "Mariama Amadou",   photo: "https://randomuser.me/api/portraits/women/21.jpg", role: "Entreprise",     org: "Banque Mondiale",email: "mariama@worldbank.ne",   tel: "+227 96 77 88 99", statut: "Actif",      date: "18 Février 2024" },
  { id: "#USR010", nom: "Yacoubou Sani",    photo: "https://randomuser.me/api/portraits/men/32.jpg",   role: "Participant",    org: "—",             email: "yacoubou@example.com",    tel: "+227 94 11 22 33", statut: "En attente", date: "15 Février 2024" },
];

export default function UtilisateursPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F9F6]">
      <DashboardSidebar items={sidebarItems} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar
          searchPlaceholder="Rechercher un utilisateur, une entreprise, une formation..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Breadcrumb */}
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[#61756B]">
            <span>Accueil</span>
            <span className="text-[#DDE8E0]">›</span>
            <span className="font-semibold text-[#0a2e16]">Utilisateurs</span>
          </div>

          {/* Hero Banner */}
          <div className="relative mb-4 h-[150px] overflow-hidden rounded-2xl bg-[#0a2e16]">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=300&fit=crop&crop=center"
                alt="hero"
                fill
                className="object-cover object-center opacity-60"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e16]/95 via-[#0a2e16]/70 to-[#0a2e16]/30" />
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <h1 className="text-[24px] font-extrabold text-white leading-tight">Gestion des utilisateurs</h1>
              <p className="mt-1 max-w-[420px] text-[11px] text-white/80 leading-relaxed">
                Gérez tous les utilisateurs de la plateforme SANE. Consultez, ajoutez, modifiez et attribuez des rôles selon les besoins.
              </p>
            </div>
            <button className="absolute right-6 top-5 flex items-center gap-1.5 rounded-lg bg-[#E57617] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter un utilisateur
            </button>
            <div className="absolute right-8 bottom-4 text-right">
              <p className="text-[17px] italic font-bold text-white leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Un Niger<br />de Talents
              </p>
              <div className="mt-1 ml-auto h-[2px] w-10 rounded-full bg-[#E57617]" />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Filter bar */}
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#DDE8E0] bg-white p-3">
            <div className="flex w-[200px] items-center gap-1.5 rounded-lg border border-[#DDE8E0] bg-[#F5F9F6] px-2.5 py-1.5">
              <Search size={13} className="shrink-0 text-[#61756B]" />
              <input type="text" placeholder="Rechercher un utilisateur..." className="w-full bg-transparent text-[11px] text-[#0a2e16] placeholder:text-[#61756B]/60 outline-none" />
            </div>
            {["Tous les rôles", "Statut", "Date d'inscription"].map(f => (
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
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Utilisateur</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Rôle</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Organisation</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Email</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Téléphone</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Statut</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Date d&apos;inscription</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[#61756B] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((u, i) => {
                  const rs = roleStyle[u.role] ?? { bg: "#F5F9F6", color: "#61756B" };
                  const ss = statutStyle[u.statut] ?? { bg: "#F5F9F6", color: "#61756B" };
                  return (
                    <tr key={i} className="border-b border-[#DDE8E0] last:border-0 hover:bg-[#F5F9F6]/50">
                      <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" /></td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#DDE8E0]">
                            <Image src={u.photo} alt={u.nom} width={32} height={32} className="object-cover" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[#0a2e16]">{u.nom}</p>
                            <p className="text-[9px] text-[#61756B]">{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: rs.bg, color: rs.color }}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-[11px] text-[#0a2e16]">{u.org}</td>
                      <td className="px-2 py-2 text-[11px] text-[#0a2e16]">{u.email}</td>
                      <td className="px-2 py-2">
                        <span className="flex items-center gap-1 text-[11px] text-[#0a2e16]">
                          <span className="text-[14px] leading-none">🇳🇪</span>
                          {u.tel}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: ss.bg, color: ss.color }}>
                          {u.statut}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-[11px] text-[#0a2e16]">{u.date}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="text-[#2563EB] hover:opacity-80"><Eye size={13} /></button>
                          <button className="text-[#10632D] hover:opacity-80"><Pencil size={13} /></button>
                          <button className="text-[#DC2626] hover:opacity-80"><Trash2 size={13} /></button>
                          <button className="text-[#61756B] hover:opacity-80"><MoreVertical size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[#DDE8E0] px-4 py-2.5">
              <span className="text-[10px] text-[#61756B]">Affichage 1 à 10 sur 1,248 utilisateurs</span>
              <div className="flex items-center gap-2">
                <select className="rounded border border-[#DDE8E0] px-1.5 py-0.5 text-[10px] text-[#0a2e16] outline-none">
                  <option>10 par page</option>
                </select>
                <div className="flex items-center gap-1">
                  <button className="rounded px-1.5 py-0.5 text-[10px] text-[#61756B]">‹</button>
                  {[1, 2, 3, 4, 5].map(p => (
                    <button key={p} className={`h-6 w-6 rounded text-[10px] font-semibold ${p === 1 ? "bg-[#10632D] text-white" : "text-[#61756B] hover:bg-[#F5F9F6]"}`}>{p}</button>
                  ))}
                  <span className="text-[10px] text-[#61756B]">...</span>
                  <button className="h-6 w-8 rounded text-[10px] text-[#61756B] hover:bg-[#F5F9F6]">125</button>
                  <button className="rounded px-1.5 py-0.5 text-[10px] text-[#61756B]">›</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
