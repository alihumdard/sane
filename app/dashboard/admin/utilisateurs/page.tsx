"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Share2, Search, Eye, Pencil, Trash2, MoreVertical,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { adminNav } from "@/lib/adminNav";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatsCard from "@/components/dashboard/StatsCard";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import { useTable } from "@/components/dashboard/useTable";
import RowActions from "@/components/dashboard/RowActions";
import TableDialogs from "@/components/dashboard/TableDialogs";

/* ─── Sidebar ─── */
const sidebarItems = adminNav("Utilisateurs", 0);

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tbl = useTable(utilisateurs, { filterKeys: { "Tous les rôles": "role", "Statut": "statut" } });
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sane-background)]">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher un utilisateur, une entreprise, une formation..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* Breadcrumb */}
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[var(--sane-text-light)]">
            <span>Accueil</span>
            <span className="text-[var(--sane-border)]">›</span>
            <span className="font-semibold text-[var(--sane-green-deep)]">Utilisateurs</span>
          </div>

          {/* Hero Banner */}
          <div className="relative mb-4 min-h-[110px] sm:h-[150px] overflow-hidden rounded-2xl bg-[var(--sane-green-deep)]">
            <div className="absolute inset-0">
              <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=300&fit=crop&crop=center" alt="hero" fill className="object-cover object-center opacity-60" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--sane-green-deep)]/95 via-[var(--sane-green-deep)]/70 to-[var(--sane-green-deep)]/30" />
            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
              <h1 className="text-[20px] sm:text-[24px] font-extrabold text-white leading-tight">Gestion des utilisateurs</h1>
              <p className="mt-1 max-w-[420px] text-[11px] text-white/80 leading-relaxed hidden sm:block">
                Gérez tous les utilisateurs de la plateforme SANE. Consultez, ajoutez, modifiez et attribuez des rôles selon les besoins.
              </p>
              <button type="button" onClick={tbl.openAdd} className="mt-3 self-start flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow sm:hidden">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Ajouter un utilisateur
              </button>
            </div>
            <button type="button" onClick={tbl.openAdd} className="absolute right-6 top-5 hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--sane-orange)] px-4 py-2 text-[12px] font-bold text-white shadow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Ajouter un utilisateur
            </button>
            <div className="absolute right-8 bottom-4 text-right hidden sm:block">
              <p className="text-[17px] italic font-bold text-white leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                Un Niger<br />de Talents
              </p>
              <div className="mt-1 ml-auto h-[2px] w-10 rounded-full bg-[var(--sane-orange)]" />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} trend={s.trend} bg={s.bg} color={s.color} />
            ))}
          </div>

          {/* Filter bar */}
          <div className="mb-3"><FilterBar searchPlaceholder="Rechercher un utilisateur..." filters={["Tous les rôles", "Statut"]} table={tbl} /></div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[var(--sane-border)] bg-white">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-[var(--sane-border)] bg-[var(--sane-background)]">
                  <th className="px-3 py-2.5 text-left"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.allSelected} onChange={tbl.toggleAll} /></th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Utilisateur</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Rôle</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Organisation</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Email</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Téléphone</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Statut</th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Date d&apos;inscription</th>
                  <th className="px-2 py-2.5 text-center text-[10px] font-semibold text-[var(--sane-text-light)] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tbl.pageRows.map((u) => {
                  const rs = roleStyle[u.role] ?? { bg: "#F5F9F6", color: "#61756B" };
                  const ss = statutStyle[u.statut] ?? { bg: "#F5F9F6", color: "#61756B" };
                  return (
                    <tr key={u._uid} className="border-b border-[var(--sane-border)] last:border-0 hover:bg-[var(--sane-background)]/50">
                      <td className="px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" checked={tbl.selected.includes(u._uid)} onChange={() => tbl.toggle(u._uid)} /></td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[var(--sane-border)]">
                            <Image src={u.photo} alt={u.nom} width={32} height={32} className="object-cover" />
                          </div>
                          <div>
                            <p className="whitespace-nowrap text-[12px] font-semibold text-[var(--sane-green-deep)]">{u.nom}</p>
                            <p className="text-[9px] text-[var(--sane-text-light)]">{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: rs.bg, color: rs.color }}>
                          {u.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-green-deep)]">{u.org}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-green-deep)]">{u.email}</td>
                      <td className="px-2 py-2">
                        <span className="flex items-center gap-1 whitespace-nowrap text-[11px] text-[var(--sane-green-deep)]">
                          <span className="text-[14px] leading-none">🇳🇪</span>
                          {u.tel}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap" style={{ backgroundColor: ss.bg, color: ss.color }}>
                          {u.statut}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-[11px] text-[var(--sane-green-deep)]">{u.date}</td>
                      <td className="px-2 py-2">
                        <RowActions table={tbl} row={u} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination current={tbl.page} totalPages={tbl.totalPages} totalItems={tbl.total} pageSize={tbl.pageSize} itemLabel="utilisateurs" onPageChange={tbl.setPage} onPageSizeChange={tbl.setPageSize} />
          </div>
        </main>
      </div>
      <TableDialogs table={tbl} entity="utilisateur" />
    </div>
  );
}
