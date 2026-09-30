"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, GraduationCap, Users, BookOpen, Award,
  Calendar, MapPin, ChevronRight, Search, Clock, Plus, Minus,
  CheckCircle2, UserCheck, FileCheck, Briefcase
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

const stats = [
  { icon: GraduationCap, value: "+20", label: "Formations" },
  { icon: Users, value: "+1000", label: "Participants" },
  { icon: BookOpen, value: "+50", label: "Experts formateurs" },
  { icon: Award, value: "Certificats", label: "reconnus" },
];

const tagColors: Record<string, string> = {
  "Management": "bg-[#10632D] text-white",
  "Digital": "bg-[#2B6CB0] text-white",
  "Entrepreneuriat": "bg-[#E57617] text-white",
  "Communication": "bg-[#6B46C1] text-white",
  "Technologie": "bg-[#0F766E] text-white",
  "Informatique": "bg-[#1D4ED8] text-white",
  "Développement personnel": "bg-[#92400E] text-white",
  "Finance": "bg-[#B91C1C] text-white",
};

const formations = [
  { tag: "Management", title: "Leadership & Management", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/Leadership.png" },
  { tag: "Digital", title: "Transformation Digitale", duree: "3 jours", places: "Places limitées", lieu: "Niamey", img: "/Transformation.png" },
  { tag: "Entrepreneuriat", title: "Entrepreneuriat des Jeunes", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/Entrepreneuriat.png" },
  { tag: "Communication", title: "Techniques de Communication", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/sane_deal.png" },
  { tag: "Technologie", title: "Compétences en Énergies Renouvelables", duree: "3 jours", places: "Places limitées", lieu: "Niamey", img: "/sane_company.png" },
  { tag: "Informatique", title: "Compétences Digitales", duree: "3 jours", places: "Places limitées", lieu: "Niamey", img: "/Transformation.png" },
  { tag: "Développement personnel", title: "Préparation à l'Emploi", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/sane_cv.png" },
  { tag: "Finance", title: "Gestion de Projet", duree: "2 jours", places: "Places limitées", lieu: "Niamey", img: "/Leadership.png" },
];

const domaines = ["Domaine de formation", "Management", "Digital", "Entrepreneuriat", "Communication", "Technologie", "Finance"];
const niveaux = ["Niveau", "Débutant", "Intermédiaire", "Avancé"];
const formats = ["Format (Présentiel / En ligne)", "Présentiel", "En ligne", "Hybride"];

const whyItems = [
  { icon: GraduationCap, label: "Formations pratiques et adaptées au marché" },
  { icon: UserCheck, label: "Des formateurs experts et reconnus" },
  { icon: FileCheck, label: "Certification de participation" },
  { icon: Briefcase, label: "Meilleures opportunités d'emploi et d'entrepreneuriat" },
];

const steps = [
  { num: "01", icon: BookOpen, title: "Choisissez votre formation", desc: "Parcourez notre catalogue et sélectionnez la formation qui vous intéresse." },
  { num: "02", icon: UserCheck, title: "Inscrivez-vous en ligne", desc: "Remplissez le formulaire d'inscription et confirmez votre participation." },
  { num: "03", icon: Users, title: "Participez à la formation", desc: "Suivez les sessions avec nos formateurs experts." },
  { num: "04", icon: Award, title: "Obtenez votre certificat", desc: "Recevez une attestation de participation à la fin de la formation." },
];

const faqs = [
  { q: "Qui peut s'inscrire aux formations ?", a: "Toute personne intéressée par le développement de ses compétences peut s'inscrire — demandeurs d'emploi, étudiants, professionnels." },
  { q: "Comment obtenir un certificat ?", a: "Un certificat de participation est remis à chaque participant ayant suivi l'intégralité de la formation." },
  { q: "Les formations sont-elles payantes ?", a: "Certaines formations sont gratuites, d'autres sont payantes. Les tarifs sont indiqués sur chaque fiche formation." },
  { q: "Les formations sont-elles en ligne ?", a: "Nous proposons des formations en présentiel, en ligne et en format hybride selon les sessions." },
  { q: "Où se déroulent les formations ?", a: "Les formations en présentiel se déroulent au Palais des Congrès de Niamey et dans différentes salles partenaires." },
  { q: "Comment être informé des prochaines sessions ?", a: "Inscrivez-vous à notre newsletter ou suivez-nous sur les réseaux sociaux pour être informé en premier." },
];

export default function FormationsPage() {
  const [search, setSearch] = useState("");
  const [domaine, setDomaine] = useState("");
  const [niveau, setNiveau] = useState("");
  const [format, setFormat] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = formations.filter((f) => {
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase());
    const matchDomaine = !domaine || domaine === "Domaine de formation" || f.tag === domaine;
    return matchSearch && matchDomaine;
  });

  return (
    <>
      <Header />
      <main>

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a4a22] via-[#0f6b35] to-[#1a9e5c]" />
          <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden">
            <Image src="/Entrepreneuriat.png" alt="" fill priority className="object-cover object-center" sizes="55vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/50 to-transparent" />
          </div>

          <Container>
            <div className="relative flex items-center gap-2 pt-5 text-[12px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={12} />
              <span className="text-white/90 font-medium">Formations</span>
            </div>

            <div className="relative grid min-h-[400px] grid-cols-1 items-center gap-8 pb-10 pt-6 lg:grid-cols-2 lg:gap-10">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-[2px] w-6 bg-[#E57617]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
                    Salon National de l&apos;Emploi
                  </span>
                </div>
                <h1 className="text-[32px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[42px] md:text-[48px]">
                  Formations du SANE
                </h1>
                <p className="mt-3 max-w-[500px] text-[15px] font-semibold leading-7 text-white/90">
                  Développez vos compétences pour un meilleur avenir.
                </p>
                <p className="mt-2 max-w-[500px] text-[13px] leading-6 text-white/65">
                  Le SANE propose des formations pratiques et adaptées aux besoins du marché du travail pour renforcer l&apos;employabilité des jeunes et accompagner le développement des compétences au Niger.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/programme" className="group inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#E57617] px-7 text-[13px] font-bold text-white !text-white transition-colors hover:bg-[#CF6812] hover:!text-white">
                    Voir le programme
                    <ArrowRight size={15} className="text-white !text-white transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link href="/inscription" className="inline-flex h-[44px] items-center justify-center rounded-full border-2 border-white px-7 text-[13px] font-bold text-white !text-white transition-colors hover:bg-white hover:!text-[#10632D]">
                    S&apos;inscrire à une formation
                  </Link>
                </div>
              </div>

              {/* Floating card */}
              <div className="relative hidden lg:block">
                <div className="absolute -top-2 right-0 z-10 w-[160px] rounded-xl bg-white px-4 py-4 shadow-xl">
                  <p className="text-[11px] font-extrabold uppercase leading-[1.7] text-[#10632D]">
                    Des compétences<br />pour un Niger<br />plus fort
                  </p>
                  <div className="mt-3 h-[3px] w-8 rounded-full bg-[#E57617]" />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ===== STATS BAR ===== */}
        <div className="border-b border-[#DDE8E0] bg-white">
          <Container>
            <div className="grid grid-cols-2 gap-6 py-6 sm:grid-cols-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className={`flex items-center gap-3 ${i !== 0 ? "sm:border-l sm:border-[#DDE8E0] sm:pl-6" : ""}`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ee]">
                      <Icon size={20} strokeWidth={2} className="text-[#E57617]" />
                    </div>
                    <div>
                      <p className="text-[20px] font-extrabold text-[#10632D]">{s.value}</p>
                      <p className="text-[12px] text-[#61756B]">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </div>

        {/* ===== SEARCH SECTION ===== */}
        <section className="bg-[#f7faf8] py-12">
          <Container>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#E57617]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">
                Trouvez votre formation
              </span>
            </div>
            <h2 className="mb-1 text-[24px] font-extrabold text-[#0a2e16] md:text-[30px]">
              Recherchez la formation qui vous correspond
            </h2>
            <p className="mb-6 text-[13px] text-[#61756B]">
              Explorez nos formations et développez les compétences dont vous avez besoin.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]" />
                <input
                  type="text"
                  placeholder="Mot-clé, formation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-[44px] w-full rounded-lg border border-[#DDE8E0] bg-white pl-9 pr-4 text-[13px] text-[#0a2e16] outline-none placeholder:text-[#9DB5A5] focus:border-[#10632D]"
                />
              </div>
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]" />
                <select value={domaine} onChange={(e) => setDomaine(e.target.value)} className="h-[44px] w-full appearance-none rounded-lg border border-[#DDE8E0] bg-white pl-9 pr-4 text-[13px] text-[#61756B] outline-none focus:border-[#10632D]">
                  {domaines.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]" />
                <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="h-[44px] w-full appearance-none rounded-lg border border-[#DDE8E0] bg-white pl-9 pr-4 text-[13px] text-[#61756B] outline-none focus:border-[#10632D]">
                  {niveaux.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]" />
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="h-[44px] w-full appearance-none rounded-lg border border-[#DDE8E0] bg-white pl-9 pr-4 text-[13px] text-[#61756B] outline-none focus:border-[#10632D]">
                  {formats.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <button className="h-[44px] shrink-0 rounded-lg bg-[#E57617] px-6 text-[13px] font-bold text-white transition-colors hover:bg-[#CF6812]">
                Rechercher
              </button>
            </div>
          </Container>
        </section>

        {/* ===== FORMATIONS GRID ===== */}
        <section className="bg-white py-12">
          <Container>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-[2px] w-6 bg-[#E57617]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">Nos Formations</span>
                </div>
                <h2 className="text-[22px] font-extrabold text-[#0a2e16] md:text-[28px]">Des formations pour tous les profils</h2>
              </div>
              <Link href="#" className="hidden items-center gap-1 text-[13px] font-bold text-[#10632D] hover:underline sm:flex">
                Voir toutes les formations <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((f) => (
                <div key={f.title} className="group flex flex-col overflow-hidden rounded-2xl border border-[#DDE8E0] bg-white transition-shadow hover:shadow-lg">
                  <div className="relative h-[160px] overflow-hidden bg-[#f0f5f2]">
                    <Image src={f.img} alt={f.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="300px" />
                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${tagColors[f.tag] ?? "bg-gray-700 text-white"}`}>
                      {f.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <h3 className="text-[14px] font-extrabold leading-snug text-[#0a2e16]">{f.title}</h3>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#61756B]">
                        <Clock size={12} strokeWidth={2} className="text-[#E57617]" /> {f.duree}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#61756B]">
                        <Users size={12} strokeWidth={2} className="text-[#E57617]" /> {f.places}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#61756B]">
                        <MapPin size={12} strokeWidth={2} className="text-[#E57617]" /> {f.lieu}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Link href="#" className="group/btn inline-flex items-center gap-2 rounded-lg border border-[#DDE8E0] px-4 py-2 text-[12px] font-bold text-[#10632D] transition-colors hover:bg-[#10632D] hover:!text-white hover:border-[#10632D]">
                        Voir la formation
                        <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ===== POURQUOI SE FORMER ===== */}
        <section className="relative overflow-hidden bg-[#0f3d20]">
          <div className="flex min-h-[220px] items-stretch">
            {/* Left image */}
            <div className="relative hidden w-[260px] shrink-0 lg:block">
              <Image src="/sane_deal.png" alt="" fill className="object-cover object-center" sizes="260px" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0f3d20]/80" />
            </div>

            {/* Right content */}
            <div className="relative flex flex-1 items-center px-6 py-10 lg:px-12">
              <div className="w-full">
                <h2 className="mb-8 text-center text-[22px] font-extrabold text-white md:text-[26px]">
                  Pourquoi se former avec le SANE ?
                </h2>
                <div className="flex flex-wrap justify-center gap-8 lg:flex-nowrap lg:gap-6">
                  {whyItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-3 text-center lg:max-w-[160px]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E57617]">
                          <Icon size={20} strokeWidth={2} className="text-white" />
                        </div>
                        <p className="text-[12px] font-semibold leading-5 text-white">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Italic text right */}
              <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-right lg:block">
                <p className="font-serif text-[18px] italic leading-[1.4] text-white/80">
                  Des talents<br />pour un Niger<br />plus fort
                </p>
                <div className="ml-auto mt-2 h-[2.5px] w-8 rounded-full bg-[#E57617]" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMMENT ÇA MARCHE ===== */}
        <section className="bg-white py-14">
          <Container>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#E57617]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">Comment ça marche ?</span>
            </div>
            <h2 className="mb-10 text-[24px] font-extrabold text-[#0a2e16] md:text-[30px]">Un processus simple et rapide</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="relative flex flex-col gap-4">
                    {i < steps.length - 1 && (
                      <div className="absolute left-[52px] top-6 hidden h-[2px] w-[calc(100%-20px)] bg-[#DDE8E0] lg:block" />
                    )}
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#10632D]">
                        <Icon size={20} strokeWidth={2} className="text-white" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E57617] text-[9px] font-extrabold text-white">
                          {step.num}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[14px] font-extrabold text-[#0a2e16]">{step.title}</h3>
                      <p className="mt-1 text-[12px] leading-5 text-[#61756B]">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ===== FAQ ===== */}
        <section className="bg-[#f7faf8] py-14">
          <Container>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[#E57617]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">Questions fréquentes</span>
            </div>
            <h2 className="mb-8 text-[24px] font-extrabold text-[#0a2e16] md:text-[30px]">FAQ - Formations</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {faqs.map((faq, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-[#DDE8E0] bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="text-[14px] font-bold text-[#0a2e16]">{faq.q}</span>
                    {openFaq === i
                      ? <Minus size={16} strokeWidth={2} className="shrink-0 text-[#E57617]" />
                      : <Plus size={16} strokeWidth={2} className="shrink-0 text-[#10632D]" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-[#DDE8E0] px-5 pb-5 pt-3">
                      <p className="text-[13px] leading-6 text-[#61756B]">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section
          className="relative min-h-[270px] overflow-hidden py-3 md:h-[280px] md:py-4"
          style={{ backgroundImage: "url('/SalonNationalbg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-[#0f3d20]/80" />
          <Container className="relative h-full">
            <div className="relative z-20 flex h-full items-center py-8 md:py-0">
              <div className="w-full md:pl-64 lg:pl-72 md:pr-16">
                <h2 className="max-w-[430px] text-[26px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[32px] md:text-[36px]">
                  Prêt à développer vos compétences ?
                </h2>
                <p className="mt-3 max-w-[470px] text-[13px] leading-relaxed text-white/85">
                  Rejoignez les formations du SANE et ouvrez la voie vers un meilleur avenir professionnel.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/programme" className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#E57617] px-5 text-[13px] font-bold text-white !text-white transition-colors hover:bg-[#CF6812] hover:!text-white">
                    Voir le programme
                    <ArrowRight size={14} className="text-white !text-white transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/inscription" className="inline-flex h-10 items-center justify-center rounded-full border border-white/80 px-5 text-[13px] font-bold text-white !text-white transition-colors hover:bg-white/10 hover:!text-white">
                    S&apos;inscrire maintenant
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute right-12 top-1/2 z-20 hidden -translate-y-1/2 text-right md:block">
              <p className="font-serif text-[20px] italic leading-[1.2] text-white">
                Des talents<br />pour un Niger<br />plus fort
              </p>
              <div className="ml-auto mt-2 h-[2.5px] w-10 rounded-full bg-[#E57617]" />
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
