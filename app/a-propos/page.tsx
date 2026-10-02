import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Building2, GraduationCap, UsersRound, Target, Eye, Star, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/sections/CTASection";

const stats = [
  { icon: BriefcaseBusiness, value: "+500", label: "Opportunités" },
  { icon: Building2, value: "+100", label: "Entreprises" },
  { icon: UsersRound, value: "+1000", label: "Participants" },
  { icon: GraduationCap, value: "+20", label: "Formations" },
];

export default function AProposPage() {
  return (
    <>
      <Header />

      <main>
        {/* ===== HERO BANNER ===== */}
        <section className="relative overflow-hidden bg-[#f0f7f2]">
          {/* Right side image - visible, no overlay */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
            <Image
              src="/hero-about.png"
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            {/* Left fade so text stays readable on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f0f7f2] via-[#f0f7f2]/80 to-transparent lg:via-[#f0f7f2]/60" />
          </div>

          <Container>
            {/* Breadcrumb */}
            <div className="relative flex items-center gap-2 pt-5 text-[12px] text-[#61756B]">
              <Link href="/" className="hover:text-[#10632D] transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <span className="text-[#0a2e16] font-medium">À propos</span>
            </div>

            <div className="relative flex min-h-[420px] flex-col items-start justify-center gap-5 py-14 sm:min-h-[480px] lg:max-w-[55%]">

              {/* Label */}
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-6 bg-[#E57617]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">
                  Salon National de l&apos;Emploi
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-tight text-[#0a2e16] sm:text-[42px] md:text-[52px]">
                À propos du <span className="text-[#10632D]">SANE</span>
              </h1>

              {/* Description */}
              <div className="flex flex-col gap-2 max-w-[520px]">
                <p className="text-[15px] leading-7 text-[#0a2e16] font-semibold">
                  Un engagement national pour l&apos;emploi, les compétences et un Niger plus fort.
                </p>
                <p className="text-[13px] leading-6 text-[#61756B]">
                  Le Salon National de l&apos;Emploi (SANE) est un espace de rencontre entre
                  les talents, les entreprises, les institutions et les opportunités, au service du
                  développement socio-économique du Niger.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/inscription"
                  className="group inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#E57617] px-7 text-[13px] font-bold text-white transition-colors hover:bg-[#CF6812]"
                >
                  Participer au SANE
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/programme"
                  className="inline-flex h-[44px] items-center justify-center rounded-full border-2 border-[#10632D] px-7 text-[13px] font-bold text-[#10632D] transition-colors hover:bg-[#10632D] hover:text-white"
                >
                  Découvrir le programme
                </Link>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  { value: "+500", label: "Opportunités" },
                  { value: "+100", label: "Entreprises" },
                  { value: "+1000", label: "Participants" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 rounded-full bg-white border border-[#DDE8E0] px-4 py-2 shadow-sm">
                    <span className="text-[13px] font-extrabold text-[#E57617]">{s.value}</span>
                    <span className="text-[12px] text-[#61756B]">{s.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </Container>
        </section>

        {/* ===== STATS BAR ===== */}
        <div className="bg-white border-b border-[#DDE8E0]">
          <Container>
            <div className="grid grid-cols-2 py-6 sm:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`flex flex-col gap-1 py-2 ${index !== 0 ? "border-l border-[#DDE8E0] pl-6" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} strokeWidth={2} className="text-[#E57617]" />
                      <span className="text-[20px] font-extrabold text-[#10632D]">{stat.value}</span>
                    </div>
                    <p className="text-[12px] text-[#61756B]">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </div>

        {/* ===== VISION SECTION ===== */}
        <section className="bg-white py-14 md:py-20">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

              {/* Left: Image grid */}
              <div className="grid grid-cols-[1.3fr_0.9fr] gap-3 max-w-full">
                {/* Tall left image */}
                <div className="relative h-[360px] overflow-hidden rounded-xl sm:h-[440px]">
                  <Image
                    src="/sane_deal.png"
                    alt="SANE événement"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 60vw, 30vw"
                  />
                </div>
                {/* Right stacked images */}
                <div className="grid grid-rows-2 gap-3 h-[360px] sm:h-[440px]">
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src="/sane_company.png"
                      alt="SANE entreprises"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 40vw, 20vw"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src="/sane_cv.png"
                      alt="SANE CV"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 40vw, 20vw"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div>
                {/* Label */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-[2px] w-6 bg-[#E57617]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#10632D]">
                    Du SANE, Niger
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-[26px] font-extrabold leading-[1.15] tracking-tight text-[#0a2e16] md:text-[34px]">
                  Le SANE, plus qu&apos;un événement,
                  <br />
                  une vision pour l&apos;avenir
                </h2>

                {/* Description */}
                <p className="mt-4 text-[14px] leading-7 text-[#61756B] md:text-[15px]">
                  Le Salon National de l&apos;Emploi est une initiative nationale qui vise
                  à favoriser l&apos;insertion professionnelle, à renforcer les compétences
                  et la culture entrepreneuriale au Niger. Il réunit chaque année
                  des entreprises, des institutions, des experts et des jeunes talents
                  autour d&apos;un objectif commun : bâtir un Niger plus fort.
                </p>

                {/* CTA Button */}
                <Link
                  href="/programme"
                  className="group mt-6 inline-flex items-center gap-3 rounded-lg bg-[#10632D] px-6 py-3 text-[13px] font-bold text-white !text-white transition-all duration-300 hover:bg-[#0B5124] hover:!text-white"
                >
                  Notre histoire
                  <ArrowRight size={15} className="text-white !text-white transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                {/* Italic quote */}
                <p className="mt-6 border-l-4 border-[#E57617] pl-4 text-[14px] italic leading-6 text-[#61756B]">
                  Ensemble pour l&apos;emploi de demain
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ===== MISSION / VISION / VALEURS ===== */}
        <section className="bg-[#0f3d20] py-14 md:py-16">
          <Container>
            <div className="grid gap-8 sm:grid-cols-3">

              {/* Notre mission */}
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E57617]/20">
                  <Target size={22} strokeWidth={2} className="text-[#E57617]" />
                </div>
                <h3 className="text-[17px] font-extrabold text-white">Notre mission</h3>
                <p className="text-[13px] leading-6 text-white/65">
                  Relier le marché entre les talents, les opportunités et les acteurs du
                  développement pour contribuer à un Niger plus fort.
                </p>
              </div>

              {/* Notre vision */}
              <div className="flex flex-col gap-4 sm:border-l sm:border-white/10 sm:pl-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E57617]/20">
                  <Eye size={22} strokeWidth={2} className="text-[#E57617]" />
                </div>
                <h3 className="text-[17px] font-extrabold text-white">Notre vision</h3>
                <p className="text-[13px] leading-6 text-white/65">
                  Devenir la référence nationale en matière d&apos;emploi, de formation
                  et d&apos;entrepreneuriat, au service du développement durable du Niger.
                </p>
              </div>

              {/* Nos valeurs */}
              <div className="flex flex-col gap-4 sm:border-l sm:border-white/10 sm:pl-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E57617]/20">
                  <Star size={22} strokeWidth={2} className="text-[#E57617]" />
                </div>
                <h3 className="text-[17px] font-extrabold text-white">Nos valeurs</h3>
                <ul className="space-y-1.5 text-[13px] text-white/65">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E57617]" /> Inclusivité
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E57617]" /> Excellence
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E57617]" /> Collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E57617]" /> Innovation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E57617]" /> Engagement pour le Niger
                  </li>
                </ul>
              </div>

            </div>
          </Container>
        </section>

        {/* ===== IMPACT SECTION ===== */}
        <section className="bg-white py-14 md:py-20">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Left: Content */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-[2px] w-6 bg-[#E57617]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">
                    Notre Impact
                  </span>
                </div>
                <h2 className="text-[26px] font-extrabold leading-[1.15] tracking-tight text-[#0a2e16] md:text-[34px]">
                  Un catalyseur d&apos;opportunités pour tous
                </h2>
                <p className="mt-4 text-[14px] leading-7 text-[#61756B] md:text-[15px]">
                  Depuis sa création, le SANE s&apos;impose comme un acteur clé de l&apos;écosystème
                  de l&apos;emploi et de la formation au Niger. Grâce à une mobilisation nationale,
                  il contribue chaque année à créer des passerelles concrètes entre les jeunes
                  talents et le monde professionnel.
                </p>
                <Link
                  href="/a-propos/impact"
                  className="group mt-6 inline-flex items-center gap-3 rounded-lg bg-[#10632D] px-6 py-3 text-[13px] font-bold text-white !text-white transition-all duration-300 hover:bg-[#0B5124] hover:!text-white"
                >
                  En savoir plus
                  <ArrowRight size={15} className="text-white !text-white transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                {/* Stats repeat */}
                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#DDE8E0] pt-8 sm:grid-cols-4">
                  {[
                    { icon: BriefcaseBusiness, value: "+500", label: "Opportunités" },
                    { icon: Building2, value: "+100", label: "Entreprises" },
                    { icon: UsersRound, value: "+1000", label: "Participants" },
                    { icon: GraduationCap, value: "+20", label: "Formations" },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className={i !== 0 ? "sm:border-l sm:border-[#DDE8E0] sm:pl-4" : ""}>
                        <div className="flex items-center gap-2">
                          <Icon size={16} strokeWidth={2} className="text-[#E57617]" />
                          <span className="text-[20px] font-extrabold text-[#10632D]">{stat.value}</span>
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#61756B]">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Image with floating tag */}
              <div className="relative">
                <div className="relative h-[380px] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/sane_deal.png"
                    alt="Impact SANE"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 right-6 text-right">
                    <p className="font-serif text-[18px] italic leading-6 text-white drop-shadow">
                      Des talents
                      <br />
                      pour un Niger
                      <br />
                      plus fort
                    </p>
                    <div className="ml-auto mt-2 h-[3px] w-10 bg-[#E57617]" />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ===== PROJET SECTION ===== */}
        <section className="bg-[#f7faf8] py-14 md:py-16">
          <Container>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#E57617]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">
                Notre Projet
              </span>
            </div>
            <h2 className="mb-10 text-[26px] font-extrabold leading-[1.15] tracking-tight text-[#0a2e16] md:text-[32px]">
              Un engagement global pour l&apos;emploi
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Pour les demandeurs d'emploi",
                  items: ["Trouver des opportunités", "Développer vos compétences", "Rencontrer des recruteurs", "Construire votre avenir"],
                },
                {
                  title: "Pour les entreprises",
                  items: ["Accéder à un vivier de talents", "Promouvoir vos offres", "Renforcer votre marque employeur", "Contribuer au développement du Niger"],
                },
                {
                  title: "Pour les partenaires",
                  items: ["Soutenir l'emploi des jeunes", "Coopérer avec le SANE", "Construire un développement durable"],
                },
                {
                  title: "Pour les institutions",
                  items: ["Mettre en œuvre les politiques d'emploi", "Renforcer les compétences nationales", "Impulser des initiatives durables"],
                },
              ].map((card) => (
                <div key={card.title} className="flex flex-col gap-4 rounded-2xl border border-[#DDE8E0] bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10632D]">
                    <BriefcaseBusiness size={20} strokeWidth={2} className="text-white" />
                  </div>
                  <h3 className="text-[15px] font-extrabold text-[#0a2e16]">{card.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-[#61756B]">
                        <CheckCircle2 size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-[#E57617]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DDE8E0] text-[#10632D] transition-colors hover:bg-[#10632D] hover:text-white">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ===== ÉQUIPE SECTION ===== */}
        <section className="bg-white py-14 md:py-16">
          <Container>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#E57617]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">
                Notre Équipe
              </span>
            </div>
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-[26px] font-extrabold leading-[1.15] tracking-tight text-[#0a2e16] md:text-[32px]">
                Une équipe engagée et expérimentée
              </h2>
              <Link href="/equipe" className="hidden items-center gap-2 text-[13px] font-bold text-[#10632D] hover:underline sm:flex">
                Voir toute l&apos;équipe <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {[
                { name: "M. Ibrahim Maiga", role: "Président du Comité d'organisation", img: "/sane_deal.png" },
                { name: "Mme Aïssatou Issa", role: "Coordinatrice des formations", img: "/sane_company.png" },
                { name: "M. Moussa Alidou", role: "Responsable Partenariats", img: "/sane_cv.png" },
                { name: "Mme Kadidia Salifou", role: "Responsable Communication", img: "/sane_deal.png" },
                { name: "M. Salim Oumar", role: "Responsable Technique", img: "/sane_company.png" },
              ].map((member) => (
                <div key={member.name} className="flex flex-col items-center gap-3 text-center">
                  <div className="relative h-[140px] w-[140px] overflow-hidden rounded-xl bg-[#f0f5f2]">
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="140px"
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold text-[#0a2e16]">{member.name}</p>
                    <p className="mt-0.5 text-[12px] text-[#61756B]">{member.role}</p>
                  </div>
                  <a
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2] text-white transition-opacity hover:opacity-80"
                    aria-label="LinkedIn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ===== CTA BANNER ===== */}
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
