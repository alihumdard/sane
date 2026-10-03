"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronRight, ArrowRight, Eye, EyeOff, Briefcase, FileText, CalendarCheck, Bell } from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const roleIcons: Record<string, React.ReactNode> = {
  participant: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>,
  entreprise: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
  recruteur: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  organisateur: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z"/></svg>,
};

const roles = [
  { key: "participant", title: "Participant" },
  { key: "entreprise", title: "Entreprise" },
  { key: "recruteur", title: "Recruteur" },
  { key: "organisateur", title: "Organisateur" },
];

const features = [
  { icon: <Briefcase size={20} />, title: "Gérez votre profil", desc: "Mettez à jour vos informations" },
  { icon: <FileText size={20} />, title: "Suivez vos candidatures", desc: "Accédez aux offres et opportunités" },
  { icon: <CalendarCheck size={20} />, title: "Accédez à vos inscriptions", desc: "Formations, conférences et ateliers" },
  { icon: <Bell size={20} />, title: "Recevez des notifications", desc: "Restez informé en temps réel" },
];

const spaceIcons: Record<string, React.ReactNode> = {
  participant: <svg className="h-6 w-6" fill="white" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>,
  entreprise: <svg className="h-6 w-6" fill="white" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
  recruteur: <svg className="h-6 w-6" fill="white" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  organisateur: <svg className="h-6 w-6" fill="white" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z"/></svg>,
};

const spaces = [
  { key: "participant", title: "Participant", desc: "Accédez aux formations, conférences, ateliers et opportunités d'emploi.", color: "#E57617" },
  { key: "entreprise", title: "Entreprise", desc: "Publiez vos offres d'emploi, rencontrez des talents et gérez vos candidatures.", color: "#10632D" },
  { key: "recruteur", title: "Recruteur", desc: "Accédez aux profils, organisez des entretiens et suivez vos recrutements.", color: "#E57617" },
  { key: "organisateur", title: "Organisateur", desc: "Gérez vos événements, participants et contenus depuis votre espace.", color: "#10632D" },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function ConnexionPage() {
  const [activeRole, setActiveRole] = useState("participant");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Header />
      <main>
        {/* ═══════════════════ 1. HERO + LOGIN FORM ═══════════════════ */}
        <section className="relative min-h-[560px] overflow-hidden bg-[#0a4a22]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/85 to-[#0a4a22]/30 z-10" />
          <div className="absolute right-0 top-0 h-full w-[60%]">
            <Image src="/sane_deal.png" alt="Connexion SANE" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/30 to-transparent" />
          </div>

          <div className="sane-container relative z-20 flex min-h-[560px] items-center py-12">
            <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
              {/* LEFT — Hero content */}
              <div>
                <nav className="mb-4 flex items-center gap-1.5 text-[12px] text-white/60">
                  <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
                  <ChevronRight size={13} />
                  <span className="text-white font-medium">Connexion</span>
                </nav>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/50">SALON NATIONAL DE L'EMPLOI</p>
                <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                  Accès aux<br />espaces utilisateurs
                </h1>
                <p className="mb-8 text-[13px] leading-relaxed text-white/65 max-w-[380px]">
                  Connectez-vous à votre espace pour gérer votre profil, accéder aux opportunités, suivre vos inscriptions et profiter de tous les services du SANE.
                </p>

                <div className="flex flex-col gap-5">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E57617] text-white">
                        {f.icon}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-white">{f.title}</p>
                        <p className="text-[11px] text-white/50">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — Login Card */}
              <div className="w-full max-w-[440px] justify-self-end rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                <h2 className="mb-1 text-2xl font-bold text-[#0a2e16]">Connexion</h2>
                <p className="mb-5 text-[13px] text-[#61756B]">Accédez à votre espace SANE</p>

                {/* Role tabs */}
                <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setActiveRole(r.key)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border px-1 py-3 text-center transition-all ${
                        activeRole === r.key
                          ? "border-[#10632D] bg-[#10632D] text-white"
                          : "border-[#DDE8E0] bg-white text-[#61756B] hover:border-[#10632D]/30"
                      }`}
                    >
                      <span className={`[&>svg]:h-5 [&>svg]:w-5 ${activeRole === r.key ? "text-white" : "text-[#10632D]"}`}>
                        {roleIcons[r.key]}
                      </span>
                      <span className="text-[10px] font-semibold leading-tight">{r.title}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#0a2e16]">
                      Email <span className="text-[#E57617]">*</span>
                    </label>
                    <div className="flex items-center rounded-lg border border-[#DDE8E0] bg-white overflow-hidden">
                      <div className="flex items-center justify-center px-3 text-[#61756B]">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="flex-1 py-3 pr-4 text-[14px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#0a2e16]">
                      Mot de passe <span className="text-[#E57617]">*</span>
                    </label>
                    <div className="flex items-center rounded-lg border border-[#DDE8E0] bg-white overflow-hidden">
                      <div className="flex items-center justify-center px-3 text-[#61756B]">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        className="flex-1 py-3 text-[14px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-3 text-[#61756B] hover:text-[#0a2e16]"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[12px] text-[#61756B] cursor-pointer">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#DDE8E0] accent-[#10632D]" />
                      Se souvenir de moi
                    </label>
                    <Link href="#" className="text-[12px] font-semibold text-[#10632D] hover:text-[#E57617]">
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E57617] py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#c9600f]"
                  >
                    Se connecter
                    <ArrowRight size={16} />
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#DDE8E0]" />
                  <span className="text-[11px] text-[#61756B]">ou continuer avec</span>
                  <div className="h-px flex-1 bg-[#DDE8E0]" />
                </div>

                {/* Social */}
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1.5 rounded-lg border border-[#DDE8E0] px-2 py-2.5 text-[12px] font-medium text-[#0a2e16] transition-all hover:bg-[#F5F9F6]">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continuer avec Google
                  </button>
                  <button className="flex items-center justify-center gap-1.5 rounded-lg border border-[#DDE8E0] px-2 py-2.5 text-[12px] font-medium text-[#0a2e16] transition-all hover:bg-[#F5F9F6]">
                    <svg className="h-3.5 w-3.5 shrink-0 fill-[#0077b5]" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.764 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    Continuer avec Linkedin
                  </button>
                </div>

                <p className="mt-5 text-center text-[12px] text-[#61756B]">
                  Vous n'avez pas encore de compte ?{" "}
                  <Link href="/inscription" className="font-semibold text-[#10632D] hover:text-[#E57617]">
                    S'inscrire maintenant <ArrowRight size={11} className="inline" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 2. ESPACES ═══════════════════ */}
        <section className="bg-white py-14">
          <div className="sane-container">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
              <span className="h-px w-6 bg-[#E57617]" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#0a2e16] lg:text-3xl">Accédez aux différents espaces</h2>
            <p className="mb-8 text-[14px] text-[#61756B]">Chaque profil dispose d'un espace dédié avec des fonctionnalités adaptées.</p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {spaces.map((s, i) => (
                <div key={i} className="flex flex-col rounded-2xl border border-[#DDE8E0] bg-[#F5F9F6] p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: s.color }}
                  >
                    {spaceIcons[s.key]}
                  </div>
                  <h3 className="mb-2 text-[15px] font-bold text-[#0a2e16]">{s.title}</h3>
                  <p className="mb-4 flex-1 text-[13px] leading-relaxed text-[#61756B]">{s.desc}</p>
                  <Link href="#" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#10632D] hover:text-[#E57617]">
                    Se connecter <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. CTA ═══════════════════ */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
