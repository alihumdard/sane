"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home, Users, Briefcase, BookOpen, Calendar, Mic,
  Handshake, Newspaper, HelpCircle, Bell, BarChart3,
  Settings, FileText, Share2, ChevronRight, Globe,
  Shield, Zap, Database, Mail, HardDrive, Code2,
  UserCog, Palette, Lock, Save, Camera,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { adminNav } from "@/lib/adminNav";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatsCard from "@/components/dashboard/StatsCard";

/* ─── Sidebar config ─── */
const sidebarItems = adminNav("Paramètres", 0);

/* ─── Stats ─── */
const statsData = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
    value: "8", label: "Sections de paramètres", trend: "+0", bg: "var(--sane-green-tint)", color: "var(--sane-green)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/><path d="M22 21v-2c0-1.5-1.4-2.8-3.5-3.4.9.7 1.5 1.7 1.5 3.4v2h2z"/></svg>,
    value: "32", label: "Utilisateurs actifs", trend: "+12%", bg: "var(--sane-blue-tint)", color: "var(--sane-blue)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>,
    value: "100%", label: "Sécurité configurée", trend: "+5%", bg: "var(--sane-green-tint)", color: "var(--sane-green)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
    value: "6", label: "Notifications actives", trend: "+20%", bg: "var(--sane-c-f0e8f5)", color: "var(--sane-purple-dark)",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>,
    value: "4", label: "Intégrations connectées", trend: "+33%", bg: "var(--sane-orange-tint)", color: "var(--sane-orange)",
  },
];

/* ─── Tabs ─── */
const tabs = [
  { icon: <Settings size={13} />, label: "Paramètres généraux" },
  { icon: <UserCog size={13} />, label: "Utilisateurs & accès" },
  { icon: <Bell size={13} />, label: "Notifications" },
  { icon: <Palette size={13} />, label: "Apparence" },
  { icon: <Globe size={13} />, label: "Langue" },
  { icon: <Shield size={13} />, label: "Sécurité" },
  { icon: <Zap size={13} />, label: "Intégrations" },
  { icon: <Database size={13} />, label: "Sauvegardes" },
];

const systemStatus = [
  { icon: <Globe size={13} />, label: "Site web" },
  { icon: <Database size={13} />, label: "Base de données" },
  { icon: <Mail size={13} />, label: "Service email" },
  { icon: <HardDrive size={13} />, label: "Stockage de fichiers" },
  { icon: <Code2 size={13} />, label: "API" },
];

const quickConfig = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2c0-2.2 3.1-4 7-4s7 1.8 7 4v2H2z"/></svg>, bg: "var(--sane-blue-tint)", color: "var(--sane-blue)", title: "Gérer les utilisateurs", desc: "Ajouter, modifier et gérer les accès" },
  { icon: <Bell size={16} />, bg: "var(--sane-c-f0e8f5)", color: "var(--sane-purple-dark)", title: "Configurer les notifications", desc: "Paramètres des emails et alertes" },
  { icon: <Palette size={16} />, bg: "var(--sane-orange-tint)", color: "var(--sane-orange)", title: "Personnaliser l'apparence", desc: "Couleurs, logo et thème" },
  { icon: <Lock size={16} />, bg: "var(--sane-orange-tint)", color: "var(--sane-orange)", title: "Sécuriser votre compte", desc: "Mot de passe et authentification" },
  { icon: <Zap size={16} />, bg: "var(--sane-blue-tint)", color: "var(--sane-blue)", title: "Connecter les intégrations", desc: "API, services externes" },
];

const DEFAULT_FORM = {
  nom: "SANEM",
  email: "contact@sanem.ne",
  tel: "20 72 35 10",
  adresse: "Niamey, Niger",
  site: "https://www.sanem.ne",
  description: "Le Salon National de l'Emploi (SANEM) est une plateforme qui connecte les talents nigériens aux opportunités d'emploi, de formation et de partenariat.",
};

/* ─── Page ─── */
export default function AdminParametresPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [toast, setToast] = useState("");

  // restore saved settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sane-admin-settings");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setForm({ ...DEFAULT_FORM, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const setField = (key: keyof typeof DEFAULT_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const save = () => {
    if (!form.nom.trim() || !form.email.trim()) {
      flash("Nom et email sont obligatoires");
      return;
    }
    try { localStorage.setItem("sane-admin-settings", JSON.stringify(form)); } catch {}
    flash("Paramètres enregistrés");
  };

  const pickImage = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set(URL.createObjectURL(file));
  };

  const quickActions = [
    () => router.push("/dashboard/admin/utilisateurs"),
    () => router.push("/dashboard/admin/notifications"),
    () => setActiveTab(3),
    () => setActiveTab(5),
    () => setActiveTab(6),
  ];

  return (
    <div className="flex h-screen bg-[var(--sane-background)] overflow-hidden">
      <DashboardSidebar items={sidebarItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardNavbar
          searchPlaceholder="Rechercher un paramètre, une section, une configuration..."
          notificationCount={5}
          userName="Admin"
          userRole="Administrateur"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:px-6 sm:py-4">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-1 text-[11px] text-[var(--sane-text-light)]">
            <span className="hover:text-[var(--sane-green)] cursor-pointer">Accueil</span>
            <ChevronRight size={12} />
            <span className="hover:text-[var(--sane-green)] cursor-pointer">Paramètres</span>
            <ChevronRight size={12} />
            <span className="font-medium text-[var(--sane-green-deep)]">Paramètres généraux</span>
          </div>

          {/* Welcome Banner */}
          <div className="relative mb-5 min-h-[110px] sm:h-[150px] overflow-hidden rounded-2xl">
            <Image src="/sane_deal.webp" alt="Banner" fill sizes="100vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
            <div className="absolute inset-0 flex items-center px-4 sm:px-8">
              <div className="max-w-[65%] sm:max-w-[55%]">
                <h1 className="text-[16px] sm:text-[22px] font-extrabold text-[var(--sane-green-deep)] leading-tight">Paramètres du système</h1>
                <p className="mt-1 text-[10px] sm:text-[11px] text-[var(--sane-text-light)] leading-relaxed hidden sm:block">
                  Configurez votre plateforme SANEM selon vos besoins. Gérez les informations générales,<br/>
                  la sécurité, les notifications et les préférences de votre organisation.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mb-5 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {statsData.map((s, i) => (
              <StatsCard key={i} {...s} />
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="mb-5 flex items-center gap-0 border-b border-[var(--sane-border)] overflow-x-auto">
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === i
                    ? "border-[var(--sane-green)] text-[var(--sane-green)] font-semibold"
                    : "border-transparent text-[var(--sane-text-light)] hover:text-[var(--sane-green-deep)]"
                }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content + Right Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4">
            {activeTab !== 0 && (
              <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-[var(--sane-border)] bg-white p-8 text-center">
                <p className="text-[14px] font-bold text-[var(--sane-green-deep)]">{tabs[activeTab].label}</p>
                <p className="mt-1 max-w-sm text-[12px] text-[var(--sane-text-light)]">
                  Cette section sera disponible prochainement. Retournez aux paramètres généraux pour modifier les informations de la plateforme.
                </p>
                <button type="button" onClick={() => setActiveTab(0)} className="mt-4 rounded-lg bg-[var(--sane-green)] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[var(--sane-green-dark)]">
                  Paramètres généraux
                </button>
              </div>
            )}
            {/* Form Card */}
            <div className={`rounded-xl border border-[var(--sane-border)] bg-white p-4 sm:p-5 min-w-0 ${activeTab === 0 ? "" : "hidden"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-px w-4 bg-[var(--sane-orange)]" />
                    <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--sane-green-deep)]">Informations de l&apos;organisation</h2>
                  </div>
                  <p className="text-[11px] text-[var(--sane-text-light)] ml-6">Configurez les informations générales de votre plateforme.</p>
                </div>
                <button type="button" onClick={save} className="flex items-center gap-2 rounded-lg bg-[var(--sane-green)] px-3 sm:px-4 py-2 text-[11px] font-bold text-white hover:bg-[var(--sane-green-dark)]">
                  <Save size={12} />
                  Enregistrer les modifications
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {/* Left fields */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[12px] font-semibold text-[var(--sane-green-deep)] mb-1.5 block">Nom de la plateforme <span className="text-red-500">*</span></label>
                    <input value={form.nom} onChange={setField("nom")} className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10" />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[var(--sane-green-deep)] mb-1.5 block">Email de contact <span className="text-red-500">*</span></label>
                    <input type="email" value={form.email} onChange={setField("email")} className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10" />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[var(--sane-green-deep)] mb-1.5 block">Téléphone</label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-2 py-2 bg-white">
                        <span className="text-[14px]">🇳🇪</span>
                        <span className="text-[11px] text-[var(--sane-green-deep)]">+227</span>
                        <ChevronRight size={11} className="text-[var(--sane-text-light)] rotate-90" />
                      </div>
                      <input value={form.tel} onChange={setField("tel")} className="flex-1 rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[var(--sane-green-deep)] mb-1.5 block">Adresse</label>
                    <input value={form.adresse} onChange={setField("adresse")} className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10" />
                  </div>
                </div>

                {/* Right: logo / favicon / site / timezone */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--sane-green-deep)] mb-2 block">Logo</label>
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-[140px] items-center justify-center rounded-xl border border-[var(--sane-border)] bg-white overflow-hidden px-3">
                        {logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoUrl} alt="Logo" className="h-12 w-auto max-w-[140px] object-contain" />
                        ) : (
                        <svg width="120" height="48" viewBox="0 0 140 48">
                          <circle cx="24" cy="24" r="22" fill="var(--sane-green)"/>
                          <text x="24" y="29" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="sans-serif">SANEM</text>
                          <path d="M6 6 Q24 0 42 6" stroke="var(--sane-orange)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                          <text x="52" y="20" fill="var(--sane-green-deep)" fontSize="16" fontWeight="800" fontFamily="sans-serif">SANEM</text>
                          <text x="52" y="31" fill="var(--sane-text-light)" fontSize="5.5" fontFamily="sans-serif">SALON</text>
                          <text x="52" y="39" fill="var(--sane-text-light)" fontSize="5" fontFamily="sans-serif">SALON NATIONAL DE L&apos;EMPLOI</text>
                        </svg>
                        )}
                      </div>
                      <div>
                        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-3 py-1.5 text-[11px] font-semibold text-[var(--sane-green-deep)] hover:bg-[var(--sane-background)]">
                          <Camera size={12} /> Changer le logo
                          <input type="file" accept="image/*" className="hidden" onChange={pickImage(setLogoUrl)} />
                        </label>
                        <p className="mt-1 text-[9px] text-[var(--sane-text-light)]">PNG, JPG ou SVG (max. 2 MB)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[var(--sane-green-deep)] mb-2 block">Favicon</label>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--sane-orange)] bg-white text-[var(--sane-orange)] font-bold text-[18px]" style={{ fontFamily: "Georgia, serif" }}>
                        {faviconUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={faviconUrl} alt="Favicon" className="h-full w-full object-cover" />
                        ) : "S"}
                      </div>
                      <div>
                        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-3 py-1.5 text-[11px] font-semibold text-[var(--sane-green-deep)] hover:bg-[var(--sane-background)]">
                          <Camera size={12} /> Changer le favicon
                          <input type="file" accept="image/*" className="hidden" onChange={pickImage(setFaviconUrl)} />
                        </label>
                        <p className="mt-1 text-[9px] text-[var(--sane-text-light)]">PNG, ICO (max. 1 MB)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-semibold text-[var(--sane-green-deep)] mb-1.5 block">Site web</label>
                    <input value={form.site} onChange={setField("site")} className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10" />
                  </div>

                  <div>
                    <label className="text-[12px] font-semibold text-[var(--sane-green-deep)] mb-1.5 block">Fuseau horaire</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] bg-white">
                        <option>(GMT+01:00) Niamey</option>
                        <option>(GMT+00:00) UTC</option>
                        <option>(GMT+01:00) Paris</option>
                      </select>
                      <ChevronRight size={13} className="absolute right-3 top-2.5 text-[var(--sane-text-light)] pointer-events-none rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description full-width */}
              <div className="mt-4">
                <label className="text-[12px] font-semibold text-[var(--sane-green-deep)] mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={setField("description")}
                  rows={3}
                  className="w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] text-[var(--sane-green-deep)] outline-none focus:border-[var(--sane-green)] resize-none"
                />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-4 min-w-0">
              {/* Statut du système */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[12px] font-bold text-[var(--sane-green-deep)]">Statut du système</h3>
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--sane-green)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--sane-green)]">Tous les services fonctionnent normalement</p>
                    <p className="text-[9px] text-[var(--sane-text-light)]">Dernière vérification : 12 Mars 2024 à 10:45</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 border-t border-[var(--sane-border)] pt-3">
                  {systemStatus.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[var(--sane-text-light)]">{s.icon}</span>
                      <span className="flex-1 text-[11px] text-[var(--sane-green-deep)]">{s.label}</span>
                      <span className="rounded-md border border-[var(--sane-green)]/30 bg-[var(--sane-green-light)] px-2 py-0.5 text-[9px] font-semibold text-[var(--sane-green)]">Actif</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration rapide */}
              <div className="rounded-xl border border-[var(--sane-border)] bg-white p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-px w-4 bg-[var(--sane-orange)]" />
                  <h3 className="text-[12px] font-bold text-[var(--sane-green-deep)]">Configuration rapide</h3>
                </div>
                <p className="text-[9px] text-[var(--sane-text-light)] mb-3 ml-6">Accès rapide aux paramètres importants.</p>
                <div className="flex flex-col gap-2">
                  {quickConfig.map((q, i) => (
                    <button key={i} type="button" onClick={quickActions[i]} className="flex items-center gap-2.5 rounded-lg hover:bg-[var(--sane-background)] p-1.5 text-left transition-all">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: q.bg, color: q.color }}>{q.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-[var(--sane-green)]">{q.title}</p>
                        <p className="text-[9px] text-[var(--sane-text-light)]">{q.desc}</p>
                      </div>
                      <ChevronRight size={13} className="text-[var(--sane-text-light)] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-[var(--sane-green-deep)] px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}
