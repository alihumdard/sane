"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Mic, GraduationCap, Building2, Search, ChevronRight, LayoutGrid, List } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

const stats = [
  { icon: Users, value: "+50", label: "Intervenants" },
  { icon: Building2, value: "+10", label: "Secteurs d'activité" },
  { icon: Mic, value: "+20", label: "Conférences" },
  { icon: GraduationCap, value: "+1000", label: "Participants" },
];

const intervenants = [
  {
    name: "M. Ibrahim Maiga",
    title: "Directeur Général",
    org: "Ministère de l'Emploi",
    tags: ["Politiques publiques", "Emploi des jeunes"],
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Mme Aïssatou Issa",
    title: "Directrice des Programmes",
    org: "ONG Internationale UNESCO",
    tags: ["Formation", "Inclusion"],
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "M. Moussa Alidou",
    title: "Expert en Développement",
    org: "Développement de Développement",
    tags: ["Innovation", "Entrepreneuriat"],
    img: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Mme Kadidia Salifou",
    title: "Responsable Communication",
    org: "SANE",
    tags: ["Communication", "Partenariats"],
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "M. Salim Oumar",
    title: "Consultant RH",
    org: "Cabinet Conseil",
    tags: ["Ressources humaines", "Insertion professionnelle"],
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Mme Fatoumata Diallo",
    title: "Spécialiste en Formation",
    org: "UNESCO",
    tags: ["Éducation", "Compétences"],
    img: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    name: "M. Abdoulaye Harouna",
    title: "Fondateur & CEO",
    org: "Tech Solutions",
    tags: ["Transformation digitale", "Entrepreneuriat"],
    img: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "M. Zakariou Idrissa",
    title: "Directeur Innovation",
    org: "Startup Niger",
    tags: ["Innovation", "Économie numérique"],
    img: "https://randomuser.me/api/portraits/men/88.jpg",
  },
];

const secteurs = ["Tous les secteurs", "Emploi", "Formation", "Entrepreneuriat", "Innovation", "Communication", "Ressources humaines"];
const domaines = ["Tous les domaines", "Politiques publiques", "Inclusion", "Transformation digitale", "Éducation", "Partenariats"];

export default function IntervenantsPage() {
  const [viewGrid, setViewGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [secteur, setSecteur] = useState("");
  const [domaine, setDomaine] = useState("");

  const filtered = intervenants.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.org.toLowerCase().includes(search.toLowerCase());
    const matchSecteur = !secteur || secteur === "Tous les secteurs" || p.tags.some(t => t.toLowerCase().includes(secteur.toLowerCase()));
    const matchDomaine = !domaine || domaine === "Tous les domaines" || p.tags.some(t => t.toLowerCase().includes(domaine.toLowerCase()));
    return matchSearch && matchSecteur && matchDomaine;
  });

  return (
    <>
      <Header />
      <main>

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a4a22] via-[#0f6b35] to-[#1a9e5c]" />
          <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden">
            <Image src="/Intervenants.png" alt="" fill priority className="object-cover object-center" sizes="55vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/50 to-transparent" />
          </div>

          <Container>
            <div className="relative flex items-center gap-2 pt-5 text-[12px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={12} />
              <span className="text-white/90 font-medium">Intervenants</span>
            </div>

            <div className="relative grid min-h-[400px] grid-cols-1 items-center gap-8 pb-10 pt-6 lg:grid-cols-2 lg:gap-10">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-[2px] w-6 bg-[#E57617]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
                    Salon National de l&apos;Emploi
                  </span>
                </div>
                <h1 className="text-[36px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[44px] md:text-[50px]">
                  Nos Intervenants
                </h1>
                <p className="mt-4 max-w-[500px] text-[15px] leading-7 text-white/85">
                  Des experts, des leaders et des professionnels engagés pour partager leurs expériences et inspirer les talents du Niger.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/programme" className="group inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#E57617] px-7 text-[13px] font-bold text-white !text-white transition-colors hover:bg-[#CF6812] hover:!text-white">
                    Voir le programme
                    <ArrowRight size={15} className="text-white !text-white transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link href="#" className="inline-flex h-[44px] items-center justify-center rounded-full border-2 border-white px-7 text-[13px] font-bold text-white !text-white transition-colors hover:bg-white hover:!text-[#10632D]">
                    Proposer un intervenant
                  </Link>
                </div>
              </div>

              {/* Floating card */}
              <div className="relative hidden lg:block">
                <div className="absolute -top-2 right-0 z-10 w-[160px] rounded-xl bg-white px-4 py-4 shadow-xl">
                  <p className="text-[11px] font-extrabold uppercase leading-[1.7] text-[#10632D]">
                    Des experts<br />pour un Niger<br />plus fort
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
                Découvrez nos intervenants
              </span>
            </div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-[26px] font-extrabold text-[#0a2e16] md:text-[32px]">Trouvez un intervenant</h2>
                <p className="mt-1 text-[13px] text-[#61756B]">Recherchez par nom, secteur ou expertise pour découvrir nos intervenants.</p>
              </div>
              <Link href="#" className="hidden items-center gap-1 text-[13px] font-bold text-[#10632D] hover:underline sm:flex">
                Voir tous les intervenants <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]" />
                <input
                  type="text"
                  placeholder="Nom de l'intervenant..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-[44px] w-full rounded-lg border border-[#DDE8E0] bg-white pl-9 pr-4 text-[13px] text-[#0a2e16] outline-none placeholder:text-[#9DB5A5] focus:border-[#10632D]"
                />
              </div>
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]" />
                <select
                  value={secteur}
                  onChange={(e) => setSecteur(e.target.value)}
                  className="h-[44px] w-full appearance-none rounded-lg border border-[#DDE8E0] bg-white pl-9 pr-4 text-[13px] text-[#61756B] outline-none focus:border-[#10632D]"
                >
                  {secteurs.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#61756B]" />
                <select
                  value={domaine}
                  onChange={(e) => setDomaine(e.target.value)}
                  className="h-[44px] w-full appearance-none rounded-lg border border-[#DDE8E0] bg-white pl-9 pr-4 text-[13px] text-[#61756B] outline-none focus:border-[#10632D]"
                >
                  {domaines.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <button className="h-[44px] rounded-lg bg-[#E57617] px-6 text-[13px] font-bold text-white transition-colors hover:bg-[#CF6812]">
                Rechercher
              </button>
            </div>
          </Container>
        </section>

        {/* ===== INTERVENANTS GRID ===== */}
        <section className="bg-white py-12">
          <Container>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-[2px] w-6 bg-[#E57617]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57617]">Nos Intervenants</span>
                </div>
                <h2 className="text-[22px] font-extrabold text-[#0a2e16] md:text-[28px]">
                  Des profils inspirants pour l&apos;avenir du Niger
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewGrid(true)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${viewGrid ? "border-[#10632D] bg-[#eaf5ee] text-[#10632D]" : "border-[#DDE8E0] text-[#61756B]"}`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewGrid(false)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${!viewGrid ? "border-[#10632D] bg-[#eaf5ee] text-[#10632D]" : "border-[#DDE8E0] text-[#61756B]"}`}
                >
                  <List size={15} />
                </button>
                <span className="ml-2 text-[13px] text-[#61756B]">Voir en liste</span>
              </div>
            </div>

            {viewGrid ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filtered.map((p) => (
                  <div key={p.name} className="group flex flex-col overflow-hidden rounded-2xl border border-[#DDE8E0] bg-white transition-shadow hover:shadow-lg">
                    <div className="relative h-[200px] overflow-hidden bg-[#f0f5f2]">
                      <Image src={p.img} alt={p.name} fill className="object-cover object-top transition-transform duration-300 group-hover:scale-105" sizes="300px" unoptimized />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="text-[15px] font-extrabold text-[#0a2e16]">{p.name}</p>
                      <p className="text-[12px] font-semibold text-[#10632D]">{p.title}</p>
                      <p className="text-[12px] text-[#61756B]">{p.org}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {p.tags.map(tag => (
                          <span key={tag} className="rounded-full bg-[#eaf5ee] px-2.5 py-0.5 text-[10px] font-bold text-[#10632D]">{tag}</span>
                        ))}
                      </div>
                      <div className="mt-auto pt-3">
                        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DDE8E0] text-[#10632D] transition-colors hover:bg-[#10632D] hover:text-white">
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((p) => (
                  <div key={p.name} className="flex items-center gap-4 rounded-xl border border-[#DDE8E0] bg-white p-4 transition-shadow hover:shadow-md">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f0f5f2]">
                      <Image src={p.img} alt={p.name} fill className="object-cover object-top" sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-extrabold text-[#0a2e16]">{p.name}</p>
                      <p className="text-[12px] text-[#61756B]">{p.title} — {p.org}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.tags.map(tag => (
                          <span key={tag} className="rounded-full bg-[#eaf5ee] px-2 py-0.5 text-[10px] font-bold text-[#10632D]">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DDE8E0] text-[#10632D] transition-colors hover:bg-[#10632D] hover:text-white">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section
          className="relative min-h-[270px] overflow-hidden py-3 md:py-4 md:h-[280px]"
          style={{ backgroundImage: "url('/SalonNationalbg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-[#0f3d20]/80" />
          <Container className="relative h-full">
            <div className="relative z-20 flex h-full items-center py-8 md:py-0">
              <div className="w-full md:pl-64 lg:pl-72 md:pr-16">
                <h2 className="max-w-[430px] text-[26px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[34px] md:text-[38px]">
                  Partagez votre expertise<br />avec les talents de demain.
                </h2>
                <p className="mt-3 max-w-[470px] text-[13px] leading-relaxed text-white/85">
                  Rejoignez le Salon National de l&apos;Emploi en tant qu&apos;intervenant et contribuez à construire un Niger plus fort.
                </p>
                <div className="mt-5">
                  <Link href="#" className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#E57617] px-6 text-[13px] font-bold text-white !text-white transition-colors hover:bg-[#CF6812] hover:!text-white">
                    Devenir intervenant
                    <ArrowRight size={14} className="text-white !text-white transition-transform group-hover:translate-x-1" />
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
