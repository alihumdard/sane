"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight, ArrowRight, Calendar } from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const stats = [
  { icon: "👥", value: "+50", label: "Articles de presse" },
  { icon: "📄", value: "+20", label: "Communiqués officiels" },
  { icon: "🎬", value: "+30", label: "Reportages médias" },
  { icon: "📸", value: "+200", label: "Photos disponibles" },
];

const articles = [
  {
    image: "/sane_deal.png",
    date: "12 Mars 2024",
    tag: "Communiqué",
    tagColor: "#E57617",
    title: "Lancement officiel du SANE 2024 à Niamey",
    description: "Le Ministère de l'Emploi annonce la tenue de la prochaine édition du Salon National de l'Emploi au Palais des Congrès de Niamey.",
  },
  {
    image: "/hero-bg.png",
    date: "08 Mars 2024",
    tag: "Événement",
    tagColor: "#10632D",
    title: "Le SANE 2024 : un carrefour d'opportunités pour les talents nigériens",
    description: "Découvrez les temps forts, les objectifs et les innovations de cette nouvelle édition qui réunit entreprises, institutions et chercheurs d'emploi.",
  },
  {
    image: "/sane_deal.png",
    date: "05 Mars 2024",
    tag: "Presse",
    tagColor: "#1a5276",
    title: "Des formations pour renforcer l'employabilité des jeunes",
    description: "Le SANE met l'accent sur le développement des compétences à travers des formations adaptées aux besoins du marché.",
  },
];

const resources = [
  {
    icon: "📰",
    iconBg: "#E57617",
    title: "Communiqués de presse",
    description: "Tous nos communiqués officiels au format PDF.",
    button: "Voir les communiqués",
  },
  {
    icon: "📷",
    iconBg: "#10632D",
    title: "Photos officielles",
    description: "Photos libres de droit pour vos publications.",
    button: "Accéder aux photos",
  },
  {
    icon: "🎥",
    iconBg: "#E57617",
    title: "Vidéos et reportages",
    description: "Revivez les moments forts du SANE en vidéo.",
    button: "Voir les vidéos",
  },
  {
    icon: "🎨",
    iconBg: "#10632D",
    title: "Kit média",
    description: "Logos, visuels, charte graphique et documents officiels.",
    button: "Télécharger le kit",
  },
];

const mediaLogos = [
  { name: "RTN", subtitle: "Télévision Nationale", abbr: "RTN", color: "#0a4a22" },
  { name: "Le Sahel", subtitle: "L'actualité du Niger", abbr: "LS", color: "#1a5276" },
  { name: "ANP", subtitle: "Agence Nigérienne de Presse", abbr: "ANP", color: "#0a2e16" },
  { name: "France 24", subtitle: "", abbr: "F24", color: "#005a9c" },
  { name: "RFI", subtitle: "", abbr: "RFI", color: "#e4022a" },
  { name: "TV5MONDE", subtitle: "", abbr: "TV5", color: "#003366" },
];

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function PressePage() {
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
              alt="Espace Presse SANE"
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
              Une visibilité<br />pour un Niger<br />plus fort
            </p>
          </div>

          <div className="sane-container relative z-20 flex min-h-[480px] flex-col justify-center py-16">
            <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={14} />
              <span className="text-white">Presse</span>
            </nav>

            <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest text-white/60">SALON NATIONAL DE L'EMPLOI</p>

            <div className="max-w-[520px]">
              <h1 className="mb-4 text-4xl font-extrabold text-white lg:text-5xl">
                Espace Presse
              </h1>
              <p className="mb-8 text-[14px] leading-relaxed text-white/75 max-w-[440px]">
                Toute l'actualité du SANE, nos communiqués, nos événements et nos ressources médias.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/programme"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E57617] px-6 py-3 text-[13px] font-semibold text-white transition-all hover:bg-[#c9600f] hover:-translate-y-0.5"
                >
                  Voir le programme
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
                >
                  Nous contacter
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
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 py-5 px-3 sm:gap-3 sm:py-7 sm:px-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F9F6] text-xl">
                    {s.icon}
                  </div>
                  <div>
                    <span className="block text-xl font-bold text-[#0a2e16]">{s.value}</span>
                    <span className="text-[12px] text-[#61756B]">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. ACTUALITÉS ═══════════════════ */}
        <section className="bg-white py-16">
          <div className="sane-container">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
                  <span className="h-px w-6 bg-[#E57617]" />
                  NOS ACTUALITÉS MÉDIAS
                </div>
                <h2 className="mb-2 text-2xl font-bold text-[#0a2e16] lg:text-3xl">
                  Dernières actualités du SANE
                </h2>
                <p className="text-[14px] text-[#61756B]">
                  Suivez les dernières nouvelles, annonces et temps forts du Salon National de l'Emploi.
                </p>
              </div>
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#10632D] transition-colors hover:text-[#E57617] whitespace-nowrap"
              >
                Voir toutes les actualités
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {articles.map((a, i) => (
                <div key={i} className="group overflow-hidden rounded-2xl border border-[#DDE8E0] bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
                  {/* Image */}
                  <div className="relative h-[200px] overflow-hidden">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* date + tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] text-white">
                        <Calendar size={13} />
                        {a.date}
                      </div>
                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                        style={{ backgroundColor: a.tagColor }}
                      >
                        {a.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="mb-2 text-[15px] font-bold leading-snug text-[#0a2e16]">
                      {a.title}
                    </h3>
                    <p className="mb-4 text-[13px] leading-relaxed text-[#61756B]">
                      {a.description}
                    </p>
                    <Link
                      href="#"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#10632D] transition-colors hover:text-[#E57617]"
                    >
                      Lire l'article
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 4. RESSOURCES MÉDIAS ═══════════════════ */}
        <section className="bg-[#F5F9F6] py-16">
          <div className="sane-container">
            <div className="mb-10">
              <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
                <span className="h-px w-6 bg-[#E57617]" />
                RESSOURCES MÉDIAS
              </div>
              <h2 className="text-2xl font-bold text-[#0a2e16] lg:text-3xl">
                Téléchargez nos ressources
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {resources.map((r, i) => (
                <div key={i} className="flex flex-col rounded-2xl border border-[#DDE8E0] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white"
                    style={{ backgroundColor: r.iconBg }}
                  >
                    {r.icon}
                  </div>
                  <h3 className="mb-2 text-[15px] font-bold text-[#0a2e16]">{r.title}</h3>
                  <p className="mb-5 flex-1 text-[13px] leading-relaxed text-[#61756B]">{r.description}</p>
                  <Link
                    href="#"
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#DDE8E0] px-4 py-2 text-[13px] font-semibold text-[#0a2e16] transition-all hover:border-[#10632D] hover:text-[#10632D]"
                  >
                    {r.button}
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 5. MÉDIAS LOGOS ═══════════════════ */}
        <section className="bg-white py-14">
          <div className="sane-container">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
                  <span className="h-px w-6 bg-[#E57617]" />
                  ILS PARLENT DU SANE
                </div>
                <h2 className="text-2xl font-bold text-[#0a2e16] lg:text-3xl">
                  Le SANE dans les médias
                </h2>
              </div>
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#10632D] transition-colors hover:text-[#E57617] whitespace-nowrap"
              >
                Voir toutes les mentions
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              {mediaLogos.map((m, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#DDE8E0] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span
                    className="text-[20px] font-extrabold tracking-tight"
                    style={{ color: m.color }}
                  >
                    {m.name}
                  </span>
                  {m.subtitle && (
                    <span className="text-center text-[10px] text-[#61756B] leading-tight">{m.subtitle}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 6. NEWSLETTER CTA ═══════════════════ */}
        <section className="relative overflow-hidden bg-[#0a4a22]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22] to-[#0a4a22]/80 z-10" />

          {/* right building image */}
          <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:block">
            <Image
              src="/sane_deal.png"
              alt=""
              fill
              className="object-cover object-center opacity-40"
            />
          </div>

          {/* right italic text */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden text-right lg:block">
            <p className="font-serif text-[18px] italic leading-snug text-white/80">
              Des talents<br />pour un Niger<br />plus fort
            </p>
          </div>

          <div className="sane-container relative z-20 py-12">
            <div className="flex items-center gap-10">
              {/* left woman image */}
              <div className="relative hidden h-[180px] w-[140px] shrink-0 overflow-hidden rounded-xl lg:block">
                <Image
                  src="https://randomuser.me/api/portraits/women/29.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* center content */}
              <div className="max-w-[480px]">
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Recevez nos actualités presse
                </h2>
                <p className="mb-6 text-[14px] leading-relaxed text-white/70">
                  Abonnez-vous pour recevoir nos communiqués et les dernières nouvelles du SANE.
                </p>

                <div className="flex gap-0 overflow-hidden rounded-lg">
                  <input
                    type="email"
                    placeholder="Votre adresse email..."
                    className="flex-1 bg-white px-4 py-3 text-[14px] text-[#0a2e16] placeholder:text-[#61756B]/50 outline-none"
                  />
                  <button className="inline-flex shrink-0 items-center gap-2 bg-[#E57617] px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#c9600f]">
                    S'abonner
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
