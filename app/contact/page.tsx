"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronRight, ArrowRight, Phone, Mail, MapPin, Clock } from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const contactStats = [
  { icon: <Phone size={20} />, value: "+227 XX XX XX XX", label: "Appelez-nous" },
  { icon: <Mail size={20} />, value: "contact@sane.ne", label: "Envoyez un email" },
  { icon: <Clock size={20} />, value: "Lun – Ven : 8h – 17h", label: "Notre disponibilité" },
  { icon: <MapPin size={20} />, value: "Niamey, Niger", label: "Notre localisation" },
];

const sujets = [
  "Sélectionnez un sujet",
  "Demande d'information",
  "Partenariat",
  "Inscription",
  "Formations",
  "Emploi",
  "Réclamation",
  "Autre",
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <main>
        {/* ═══════════════════ 1. HERO ═══════════════════ */}
        <section className="relative min-h-[480px] overflow-hidden bg-[#0a4a22]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/95 to-[#0a4a22]/40 z-10" />

          <div className="absolute right-0 top-0 h-full w-1/2">
            <Image
              src="/sane_deal.png"
              alt="Contact SANE"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/40 to-transparent" />
          </div>

          <div className="absolute right-8 top-20 z-20 hidden rounded-lg border border-white/20 bg-[#E57617] px-4 py-3 text-[11px] font-bold leading-snug text-white lg:block">
            EMPLOI<br />FORMATION<br />OPPORTUNITÉS<br />AVENIR
          </div>

          <div className="absolute right-8 bottom-16 z-20 hidden text-right lg:block">
            <p className="font-serif text-[18px] italic leading-snug text-white/80">
              Des échanges<br />pour un Niger<br />plus fort
            </p>
          </div>

          <div className="sane-container relative z-20 flex min-h-[480px] flex-col justify-center py-16">
            <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={14} />
              <span className="text-white">Contact</span>
            </nav>

            <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest text-white/60">SALON NATIONAL DE L'EMPLOI</p>

            <div className="max-w-[520px]">
              <h1 className="mb-2 text-4xl font-extrabold text-white lg:text-5xl">
                Contactez le SANE
              </h1>
              <p className="mb-4 text-xl font-bold text-white/90">Nous sommes à votre écoute.</p>
              <p className="mb-8 text-[14px] leading-relaxed text-white/70 max-w-[440px]">
                Une question, une demande d'information ou une proposition de partenariat ? Notre équipe est disponible pour vous répondre et vous accompagner.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#contact-form"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E57617] px-6 py-3 text-[13px] font-semibold text-white transition-all hover:bg-[#c9600f] hover:-translate-y-0.5"
                >
                  Nous écrire
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/programme"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
                >
                  Voir le programme
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 2. STATS BAR ═══════════════════ */}
        <section className="bg-white border-b border-[#DDE8E0]">
          <div className="sane-container">
            <div className="grid grid-cols-2 divide-x divide-[#DDE8E0] lg:grid-cols-4">
              {contactStats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 py-7 px-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E57617]/10 text-[#E57617]">
                    {s.icon}
                  </div>
                  <div>
                    <span className="block text-[14px] font-bold text-[#0a2e16]">{s.value}</span>
                    <span className="text-[12px] text-[#61756B]">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. FORM + COORDONNÉES ═══════════════════ */}
        <section id="contact-form" className="bg-[#F5F9F6] py-16">
          <div className="sane-container">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              {/* LEFT — Form */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
                  <span className="h-px w-6 bg-[#E57617]" />
                  NOUS CONTACTER
                </div>
                <h2 className="mb-2 text-2xl font-bold text-[#0a2e16] lg:text-3xl">
                  Envoyez-nous un message
                </h2>
                <p className="mb-8 text-[14px] text-[#61756B]">
                  Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
                </p>

                <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  {/* Row 1: Nom + Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-[#0a2e16]">
                        Nom complet <span className="text-[#E57617]">*</span>
                      </label>
                      <input
                        type="text"
                        name="nom"
                        placeholder="Votre nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#DDE8E0] bg-white px-4 py-2.5 text-[14px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none transition-colors focus:border-[#10632D] focus:ring-1 focus:ring-[#10632D]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-[#0a2e16]">
                        Email <span className="text-[#E57617]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="exemple@nom.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#DDE8E0] bg-white px-4 py-2.5 text-[14px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none transition-colors focus:border-[#10632D] focus:ring-1 focus:ring-[#10632D]/20"
                      />
                    </div>
                  </div>

                  {/* Row 2: Téléphone + Sujet */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-[#0a2e16]">
                        Téléphone
                      </label>
                      <div className="flex overflow-hidden rounded-lg border border-[#DDE8E0] bg-white">
                        <div className="flex items-center gap-1.5 border-r border-[#DDE8E0] bg-[#F5F9F6] px-3 text-[13px] text-[#61756B]">
                          <span>🇳🇪</span>
                          <span>+227</span>
                        </div>
                        <input
                          type="tel"
                          name="telephone"
                          placeholder="XX XX XX XX"
                          value={formData.telephone}
                          onChange={handleChange}
                          className="w-full bg-transparent px-3 py-2.5 text-[14px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-[#0a2e16]">
                        Sujet <span className="text-[#E57617]">*</span>
                      </label>
                      <select
                        name="sujet"
                        value={formData.sujet}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#DDE8E0] bg-white px-4 py-2.5 text-[14px] text-[#0a2e16] outline-none transition-colors focus:border-[#10632D] focus:ring-1 focus:ring-[#10632D]/20 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2361756B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-10"
                      >
                        {sujets.map((s, i) => (
                          <option key={i} value={i === 0 ? "" : s} disabled={i === 0}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#0a2e16]">
                      Votre message <span className="text-[#E57617]">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Écrivez votre message ici..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full resize-none rounded-lg border border-[#DDE8E0] bg-white px-4 py-3 text-[14px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none transition-colors focus:border-[#10632D] focus:ring-1 focus:ring-[#10632D]/20"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E57617] py-3.5 text-[14px] font-semibold text-white transition-all hover:bg-[#c9600f] hover:-translate-y-0.5"
                  >
                    Envoyer le message
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>

              {/* RIGHT — Coordonnées */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#0a2e16]">
                  <span className="h-px w-4 bg-[#E57617]" />
                  NOS COORDONNÉES
                </div>
                <p className="mb-8 text-[14px] text-[#61756B]">
                  Plusieurs moyens pour nous joindre.
                </p>

                <div className="flex flex-col gap-6">
                  {/* Téléphone */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E57617] text-white">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0a2e16]">Téléphone</p>
                      <p className="text-[15px] font-bold text-[#0a2e16]">+227 XX XX XX XX</p>
                      <p className="text-[12px] text-[#61756B]">Lun – Ven : 8h – 17h</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E57617] text-white">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0a2e16]">Email</p>
                      <p className="text-[15px] font-bold text-[#0a2e16]">contact@sane.ne</p>
                      <p className="text-[12px] text-[#61756B]">Nous répondons sous 24h</p>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E57617] text-white">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0a2e16]">Adresse</p>
                      <p className="text-[15px] font-bold text-[#0a2e16]">Palais des Congrès de Niamey</p>
                      <p className="text-[12px] text-[#61756B]">Niamey, Niger</p>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E57617] text-white">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0a2e16]">Horaires</p>
                      <p className="text-[15px] font-bold text-[#0a2e16]">Lundi – Vendredi : 8h – 17h</p>
                      <p className="text-[12px] text-[#61756B]">Samedi – Dimanche : Fermé</p>
                    </div>
                  </div>
                </div>

                {/* Social icons */}
                <div className="mt-8">
                  <p className="mb-3 text-[13px] font-semibold text-[#0a2e16]">Suivez-nous</p>
                  <div className="flex items-center gap-2.5">
                    {[
                      { label: "Facebook", path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
                      { label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                      { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                      { label: "LinkedIn", path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.764 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
                      { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                    ].map((social, i) => (
                      <a
                        key={i}
                        href="#"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10632D] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#E57617]"
                      >
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d={social.path} /></svg>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Niger map with pin */}
                <div className="mt-8 flex items-center justify-center">
                  <div className="relative">
                    <svg className="h-[120px] w-[160px] text-[#10632D]/15" viewBox="0 0 200 160" fill="currentColor">
                      <path d="M40 20 C60 10, 100 5, 140 15 C160 20, 180 35, 185 60 C190 85, 175 110, 155 125 C135 140, 105 145, 80 140 C55 135, 35 120, 25 100 C15 80, 20 50, 30 35 C35 25, 38 22, 40 20Z" />
                    </svg>
                    <div className="absolute right-6 top-8 flex flex-col items-center">
                      <MapPin size={22} className="text-[#E57617] fill-[#E57617]" />
                      <span className="mt-1 text-[12px] font-bold text-[#10632D]">Niamey</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 4. LOCALISATION ═══════════════════ */}
        <section className="bg-white py-16">
          <div className="sane-container">
            <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
              <span className="h-px w-6 bg-[#E57617]" />
              NOTRE LOCALISATION
            </div>
            <h2 className="mb-8 text-2xl font-bold text-[#0a2e16] lg:text-3xl">
              Retrouvez-nous au Palais des Congrès
            </h2>

            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Left — Image */}
              <div className="relative h-[300px] overflow-hidden rounded-2xl lg:h-[360px]">
                <Image
                  src="/sane_deal.png"
                  alt="Palais des Congrès de Niamey"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-white/90 px-4 py-2 text-[14px] font-bold text-[#0a2e16] backdrop-blur-sm">
                  PALAIS DES CONGRÈS<br />DE NIAMEY
                </div>
              </div>

              {/* Right — Info */}
              <div>
                <h3 className="mb-4 text-xl font-bold text-[#0a2e16]">Lieu de l'événement</h3>
                <p className="mb-6 text-[14px] leading-relaxed text-[#61756B]">
                  Le Salon National de l'Emploi (SANE) se tient au Palais des Congrès de Niamey, un lieu moderne et accessible, situé au cœur de la capitale. Rejoignez-nous pour découvrir des opportunités et rencontrer les acteurs clés de l'emploi au Niger.
                </p>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-[#E57617]" />
                    <div>
                      <p className="text-[14px] font-semibold text-[#0a2e16]">Palais des Congrès de Niamey</p>
                      <p className="text-[13px] text-[#61756B]">Niamey, Niger</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-[18px] w-[18px] shrink-0 text-[#E57617]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 3v18" />
                    </svg>
                    <p className="text-[14px] text-[#61756B]">Accès facile et parking disponible</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-[18px] w-[18px] shrink-0 text-[#E57617]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M6 12h.01M18 12h.01" />
                    </svg>
                    <p className="text-[14px] text-[#61756B]">Accessible en transport public</p>
                  </div>
                </div>

                <Link
                  href="https://maps.google.com/?q=Palais+des+Congres+Niamey+Niger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#DDE8E0] px-5 py-2.5 text-[13px] font-semibold text-[#0a2e16] transition-all hover:border-[#10632D] hover:text-[#10632D]"
                >
                  Voir sur la carte
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 5. MAP SECTION ═══════════════════ */}
        <section className="bg-[#F5F9F6] py-10">
          <div className="sane-container">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
              {/* Left card */}
              <div className="rounded-xl border border-[#DDE8E0] bg-white p-5">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-[#E57617]" />
                  <span className="text-[14px] font-bold text-[#0a2e16]">Palais des Congrès de Niamey</span>
                </div>
                <p className="mb-4 text-[13px] text-[#61756B]">Niamey, Niger</p>
                <Link
                  href="https://maps.google.com/?q=Palais+des+Congres+Niamey+Niger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E57617] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#c9600f]"
                >
                  Ouvrir dans Google Maps
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Right — Map placeholder */}
              <div className="relative h-[280px] overflow-hidden rounded-xl border border-[#DDE8E0] bg-[#e8ece9] lg:h-[300px]">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <MapPin size={40} className="mx-auto mb-3 text-[#E57617]" />
                    <p className="text-[15px] font-bold text-[#0a2e16]">Palais des Congrès<br />de Niamey</p>
                    <p className="mt-1 text-[13px] text-[#61756B]">Niamey, Niger</p>
                  </div>
                </div>
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
