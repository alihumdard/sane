"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronRight, ArrowRight, Calendar, MapPin, Clock, Phone, Mail, Check, Plus, FileText, Camera, User, Briefcase } from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const stats = [
  {
    icon: <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>,
    title: "Accès au salon",
    desc: "Entrée gratuite",
    color: "#E57617",
  },
  {
    icon: <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
    title: "Rencontres",
    desc: "Entreprises et recruteurs",
    color: "#10632D",
  },
  {
    icon: <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
    title: "Formations",
    desc: "Ateliers et conférences",
    color: "#10632D",
  },
  {
    icon: <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a3 3 0 00-3-3c-1.05 0-1.95.56-2.47 1.37L12 4.13l-.53-.76A2.98 2.98 0 009 2a3 3 0 00-3 3c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>,
    title: "Opportunités",
    desc: "Offres d'emploi exclusives",
    color: "#E57617",
  },
];

const steps = [
  { num: 1, label: "Informations personnelles" },
  { num: 2, label: "Profil et parcours" },
  { num: 3, label: "Centre d'intérêt" },
  { num: 4, label: "Confirmation" },
];

const whyItems = [
  "Accès gratuit au salon",
  "Participation aux conférences et ateliers",
  "Rencontre avec des recruteurs",
  "Accès aux offres d'emploi",
  "Certificat de participation",
  "Réseautage avec des professionnels",
];

const documents = [
  { icon: <FileText size={22} />, title: "Pièce d'identité", desc: "Carte nationale ou passeport", format: "Format : PDF, JPG (max 2 Mo)", color: "#E57617" },
  { icon: <FileText size={22} />, title: "CV à jour", desc: "Votre curriculum vitae", format: "Format : PDF (max 2 Mo)", color: "#10632D" },
  { icon: <Mail size={22} />, title: "Lettre de motivation (optionnelle)", desc: "Pour certaines opportunités", format: "Format : PDF (max 2 Mo)", color: "#E57617" },
  { icon: <Camera size={22} />, title: "Photo d'identité", desc: "Photo récente", format: "Format : JPG, PNG (max 2 Mo)", color: "#10632D" },
];

const faqs = [
  { q: "L'inscription est-elle gratuite ?", a: "Oui, l'inscription au Salon National de l'Emploi est entièrement gratuite pour tous les participants." },
  { q: "Y a-t-il une date limite d'inscription ?", a: "Les inscriptions sont ouvertes jusqu'à la veille de l'événement, mais nous recommandons de s'inscrire à l'avance." },
  { q: "Quels documents sont nécessaires ?", a: "Une pièce d'identité valide et un CV à jour sont requis. La lettre de motivation est optionnelle." },
  { q: "Vais-je recevoir une confirmation ?", a: "Oui, un email de confirmation avec votre badge sera envoyé après validation de votre inscription." },
  { q: "Puis-je m'inscrire à plusieurs activités ?", a: "Oui, vous pouvez vous inscrire à autant d'activités que vous le souhaitez dans la limite des places disponibles." },
  { q: "Puis-je modifier mes informations après l'inscription ?", a: "Oui, vous pourrez modifier vos informations depuis votre espace personnel jusqu'au jour de l'événement." },
];

/* ─────────────────────────────── COMPONENTS ─────────────────────────────── */

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#DDE8E0]">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-3.5 text-left">
        <span className="text-[13px] font-semibold text-[#0a2e16]">{q}</span>
        <Plus size={16} className={`shrink-0 text-[#10632D] transition-transform ${open ? "rotate-45" : ""}`} />
      </button>
      {open && <p className="pb-3 text-[12px] leading-relaxed text-[#61756B]">{a}</p>}
    </div>
  );
}

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function InscriptionPage() {
  const [activeStep] = useState(1);

  return (
    <>
      <Header />
      <main>
        {/* ═══════════════════ 1. HERO ═══════════════════ */}
        <section className="relative min-h-[480px] overflow-hidden bg-[#0a4a22]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/85 to-[#0a4a22]/30 z-10" />
          <div className="absolute right-0 top-0 h-full w-[55%]">
            <Image src="/sane_deal.png" alt="Inscription SANE" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/30 to-transparent" />
          </div>

          <div className="absolute right-6 top-6 z-20 rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase leading-relaxed tracking-wider text-white">
              EMPLOI<br />FORMATION<br />OPPORTUNITÉS<br />AVENIR
            </p>
          </div>
          <p className="absolute bottom-8 right-8 z-20 text-lg italic text-white/70" style={{ fontFamily: "serif" }}>
            Un Niger<br />de Talents
          </p>

          <div className="sane-container relative z-20 flex min-h-[480px] items-center py-12">
            <div className="max-w-lg">
              <nav className="mb-4 flex items-center gap-1.5 text-[12px] text-white/60">
                <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
                <ChevronRight size={13} />
                <span className="text-white font-medium">Inscription participant</span>
              </nav>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/50">SALON NATIONAL DE L'EMPLOI</p>
              <h1 className="mb-3 text-4xl font-extrabold leading-tight text-white lg:text-5xl">
                Inscription<br />Participant
              </h1>
              <p className="mb-2 text-[15px] font-semibold text-white">Rejoignez le SANE et vivez une expérience unique.</p>
              <p className="mb-6 text-[13px] leading-relaxed text-white/65 max-w-[420px]">
                Inscrivez-vous pour participer au Salon National de l'Emploi et accédez aux conférences, formations, rencontres et opportunités d'emploi.
              </p>
              <div className="flex gap-3">
                <Link href="#form" className="flex items-center gap-2 rounded-lg bg-[#E57617] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#c9600f] transition-all">
                  Créer mon compte <ArrowRight size={14} />
                </Link>
                <Link href="/programme" className="flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-white/10 transition-all">
                  Voir le programme <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 2. STATS BAR ═══════════════════ */}
        <section className="border-b border-[#DDE8E0] bg-white">
          <div className="sane-container grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#DDE8E0]">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-5 px-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0a2e16]">{s.title}</p>
                  <p className="text-[12px] text-[#61756B]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════ 3. REGISTRATION FORM + SIDEBAR ═══════════════════ */}
        <section id="form" className="bg-[#F5F9F6] py-14">
          <div className="sane-container">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
              <span className="h-px w-6 bg-[#E57617]" />
              INSCRIPTION
            </div>
            <h2 className="mb-1 text-2xl font-bold text-[#0a2e16]">Créez votre compte participant</h2>
            <p className="mb-8 text-[13px] text-[#61756B]">Remplissez le formulaire ci-dessous pour vous inscrire au Salon National de l'Emploi.</p>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              {/* LEFT — Form */}
              <div>
                {/* Step Progress */}
                <div className="mb-8 flex items-center">
                  {steps.map((s, i) => (
                    <div key={i} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold ${
                          s.num <= activeStep ? "bg-[#E57617] text-white" : "bg-[#DDE8E0] text-[#61756B]"
                        }`}>
                          {s.num}
                        </div>
                        <span className="mt-1.5 text-[10px] font-medium text-[#0a2e16] text-center max-w-[90px]">{s.label}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`mx-2 mt-[-18px] h-[2px] flex-1 ${s.num < activeStep ? "bg-[#E57617]" : "bg-[#DDE8E0]"}`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-1 text-lg font-bold text-[#0a2e16]">Informations personnelles</h3>
                  <p className="mb-5 text-[12px] text-[#61756B]">Veuillez renseigner vos informations personnelles.</p>

                  <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nom complet */}
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-[#0a2e16]">Nom complet <span className="text-[#E57617]">*</span></label>
                        <div className="flex items-center rounded-lg border border-[#DDE8E0] bg-white overflow-hidden">
                          <div className="px-3 text-[#61756B]"><User size={14} /></div>
                          <input type="text" placeholder="Votre nom complet" className="flex-1 py-2.5 pr-3 text-[12px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none" />
                        </div>
                      </div>
                      {/* Date de naissance */}
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-[#0a2e16]">Date de naissance <span className="text-[#E57617]">*</span></label>
                        <div className="flex items-center rounded-lg border border-[#DDE8E0] bg-white overflow-hidden">
                          <div className="px-3 text-[#61756B]"><Calendar size={14} /></div>
                          <input type="text" placeholder="JJ / MM / AAAA" className="flex-1 py-2.5 pr-3 text-[12px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-[#0a2e16]">Email <span className="text-[#E57617]">*</span></label>
                        <div className="flex items-center rounded-lg border border-[#DDE8E0] bg-white overflow-hidden">
                          <div className="px-3 text-[#61756B]"><Mail size={14} /></div>
                          <input type="email" placeholder="exemple@domaine.com" className="flex-1 py-2.5 pr-3 text-[12px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none" />
                        </div>
                      </div>
                      {/* Téléphone */}
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-[#0a2e16]">Téléphone <span className="text-[#E57617]">*</span></label>
                        <div className="flex items-center rounded-lg border border-[#DDE8E0] bg-white overflow-hidden">
                          <div className="flex items-center gap-1.5 border-r border-[#DDE8E0] px-3 py-2.5">
                            <span className="text-[12px]">🇳🇪</span>
                            <span className="text-[11px] text-[#61756B]">+227</span>
                          </div>
                          <input type="tel" placeholder="XX XX XX XX" className="flex-1 py-2.5 px-3 text-[12px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Genre */}
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-[#0a2e16]">Genre <span className="text-[#E57617]">*</span></label>
                        <select className="w-full rounded-lg border border-[#DDE8E0] bg-white px-3 py-2.5 text-[12px] text-[#61756B] outline-none">
                          <option>Sélectionnez votre genre</option>
                          <option>Homme</option>
                          <option>Femme</option>
                        </select>
                      </div>
                      {/* Nationalité */}
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-[#0a2e16]">Nationalité <span className="text-[#E57617]">*</span></label>
                        <select className="w-full rounded-lg border border-[#DDE8E0] bg-white px-3 py-2.5 text-[12px] text-[#61756B] outline-none">
                          <option>Niger</option>
                          <option>Nigeria</option>
                          <option>Mali</option>
                          <option>Burkina Faso</option>
                          <option>Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Ville */}
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-[#0a2e16]">Ville de résidence <span className="text-[#E57617]">*</span></label>
                        <select className="w-full rounded-lg border border-[#DDE8E0] bg-white px-3 py-2.5 text-[12px] text-[#61756B] outline-none">
                          <option>Sélectionnez votre ville</option>
                          <option>Niamey</option>
                          <option>Zinder</option>
                          <option>Maradi</option>
                          <option>Tahoua</option>
                          <option>Agadez</option>
                        </select>
                      </div>
                      {/* Niveau d'études */}
                      <div>
                        <label className="mb-1.5 block text-[12px] font-semibold text-[#0a2e16]">Niveau d'études <span className="text-[#E57617]">*</span></label>
                        <select className="w-full rounded-lg border border-[#DDE8E0] bg-white px-3 py-2.5 text-[12px] text-[#61756B] outline-none">
                          <option>Sélectionnez votre niveau d'études</option>
                          <option>Baccalauréat</option>
                          <option>Licence</option>
                          <option>Master</option>
                          <option>Doctorat</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E57617] py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#c9600f]">
                      Étape suivante <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT — Sidebar */}
              <div className="flex flex-col gap-6">
                {/* Image */}
                <div className="relative h-48 overflow-hidden rounded-2xl">
                  <Image src="/sane_deal.png" alt="SANE" fill className="object-cover" />
                  <div className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-1.5 shadow">
                    <span className="text-[14px] font-extrabold text-[#10632D]">SANE</span>
                  </div>
                </div>

                {/* Pourquoi s'inscrire */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-[15px] font-bold text-[#0a2e16]">Pourquoi s'inscrire ?</h3>
                  <p className="mb-4 text-[12px] text-[#61756B]">L'inscription vous permet de participer à toutes les activités du SANE et de bénéficier de plusieurs avantages exclusifs.</p>
                  <div className="flex flex-col gap-2.5">
                    {whyItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10632D]">
                          <Check size={11} className="text-white" />
                        </div>
                        <span className="text-[12px] text-[#0a2e16]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informations pratiques */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-px w-4 bg-[#E57617]" />
                    <span className="text-[11px] font-semibold text-[#E57617]">Informations pratiques</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10632D] text-white"><Calendar size={14} /></div>
                      <div>
                        <p className="text-[12px] font-bold text-[#0a2e16]">Date de l'événement</p>
                        <p className="text-[11px] text-[#61756B]">À confirmer – 2024</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E57617] text-white"><MapPin size={14} /></div>
                      <div>
                        <p className="text-[12px] font-bold text-[#0a2e16]">Lieu</p>
                        <p className="text-[11px] text-[#61756B]">Palais des Congrès de Niamey</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10632D] text-white"><Clock size={14} /></div>
                      <div>
                        <p className="text-[12px] font-bold text-[#0a2e16]">Horaires</p>
                        <p className="text-[11px] text-[#61756B]">08h00 – 17h00</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E57617] text-white"><Phone size={14} /></div>
                      <div>
                        <p className="text-[12px] font-bold text-[#0a2e16]">Contact</p>
                        <p className="text-[11px] text-[#61756B]">+227 XX XX XX XX</p>
                        <p className="text-[11px] text-[#61756B]">contact@sane.ne</p>
                      </div>
                    </div>
                  </div>

                  {/* Niamey pin */}
                  <div className="mt-4 flex items-center justify-end gap-1">
                    <MapPin size={14} className="text-[#E57617]" />
                    <span className="text-[12px] font-semibold text-[#E57617]">Niamey</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 4. DOCUMENTS REQUIS ═══════════════════ */}
        <section className="bg-white py-14">
          <div className="sane-container">
            <div className="mb-2 flex items-center gap-3">
              <Briefcase size={22} className="text-[#10632D]" />
              <div>
                <h2 className="text-xl font-bold text-[#0a2e16]">Documents requis</h2>
                <p className="text-[12px] text-[#61756B]">Préparez les documents suivants pour compléter votre inscription.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {documents.map((d, i) => (
                <div key={i} className="rounded-2xl border border-[#DDE8E0] bg-[#F5F9F6] p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: d.color }}>
                    {d.icon}
                  </div>
                  <h3 className="mb-1 text-[13px] font-bold text-[#0a2e16]">{d.title}</h3>
                  <p className="text-[11px] text-[#61756B]">{d.desc}</p>
                  <p className="mt-1 text-[10px] text-[#61756B]/70">{d.format}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 5. FAQ ═══════════════════ */}
        <section className="bg-[#F5F9F6] py-14">
          <div className="sane-container">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6 text-[#10632D]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41.7 1.15 1.11 3.3.03 4.9-1.2 1.77-2.35 2.31-2.97 3.45-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15zM14 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/></svg>
                <div>
                  <h2 className="text-xl font-bold text-[#0a2e16]">Questions fréquentes</h2>
                  <p className="text-[12px] text-[#61756B]">Trouvez des réponses aux questions les plus courantes sur l'inscription.</p>
                </div>
              </div>
              <Link href="/faq" className="flex items-center gap-1.5 text-[13px] font-semibold text-[#10632D] hover:text-[#E57617]">
                Voir toutes les questions <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
              <div>
                {faqs.slice(0, 3).map((f, i) => (
                  <AccordionItem key={i} q={f.q} a={f.a} />
                ))}
              </div>
              <div>
                {faqs.slice(3).map((f, i) => (
                  <AccordionItem key={i} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 6. CTA ═══════════════════ */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
