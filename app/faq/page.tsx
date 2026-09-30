"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronRight, ArrowRight, Plus, Minus, MessageCircle, Users, Zap, Headphones } from "lucide-react";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const stats = [
  { icon: <MessageCircle size={22} />, value: "50+", label: "Questions fréquentes" },
  { icon: <Users size={22} />, value: "4", label: "Thématiques principales" },
  { icon: <Zap size={22} />, value: "Réponses rapides", label: "et claires" },
  { icon: <Headphones size={22} />, value: "Notre équipe", label: "à votre écoute" },
];

const categories = [
  { key: "generalites", icon: "🏛️", title: "Généralités", subtitle: "Questions sur le SANE" },
  { key: "inscriptions", icon: "👤", title: "Inscriptions", subtitle: "Participation et accès" },
  { key: "formations", icon: "🎓", title: "Formations", subtitle: "Programmes et certificats" },
  { key: "emploi", icon: "💼", title: "Emploi", subtitle: "Offres et opportunités" },
  { key: "partenaires", icon: "🤝", title: "Partenaires", subtitle: "Collaborations et soutien" },
];

const faqData: Record<string, { question: string; answer: string }[]> = {
  generalites: [
    { question: "Qu'est-ce que le Salon National de l'Emploi (SANE) ?", answer: "Le SANE est un événement national qui vise à connecter les talents, les entreprises, les institutions et les organisations pour favoriser l'emploi, la formation et le développement des compétences au Niger." },
    { question: "Quand et où se déroule le SANE ?", answer: "Le SANE se déroule annuellement à Niamey, Niger. Les dates exactes sont communiquées sur notre site et nos réseaux sociaux plusieurs mois à l'avance." },
    { question: "Qui peut participer au SANE ?", answer: "Le SANE est ouvert à tous : demandeurs d'emploi, étudiants, professionnels en reconversion, entreprises, institutions publiques et organisations internationales." },
    { question: "L'entrée au salon est-elle gratuite ?", answer: "Oui, l'accès au salon est entièrement gratuit pour les visiteurs et les demandeurs d'emploi. Certaines formations spécialisées peuvent nécessiter une inscription préalable." },
    { question: "Quels sont les objectifs du SANE ?", answer: "Les objectifs principaux sont de faciliter la mise en relation entre employeurs et demandeurs d'emploi, promouvoir la formation professionnelle, et contribuer au développement économique du Niger." },
    { question: "Comment puis-je contacter l'équipe organisatrice ?", answer: "Vous pouvez nous contacter via notre page Contact, par email à contact@sane.ne, ou par téléphone au +227 XX XX XX XX." },
  ],
  inscriptions: [
    { question: "Comment s'inscrire au SANE ?", answer: "L'inscription se fait en ligne via notre plateforme. Cliquez sur 'S'inscrire' dans le menu principal et suivez les étapes indiquées." },
    { question: "Y a-t-il une date limite d'inscription ?", answer: "Les inscriptions sont ouvertes jusqu'à la veille de l'événement, mais nous recommandons de s'inscrire le plus tôt possible pour bénéficier de toutes les activités." },
    { question: "Quels documents sont nécessaires ?", answer: "Une pièce d'identité valide et un CV à jour sont recommandés. Pour les entreprises, un document justificatif de l'entreprise est requis." },
    { question: "Puis-je m'inscrire à plusieurs activités ?", answer: "Oui, vous pouvez vous inscrire à autant d'activités que vous le souhaitez, dans la limite des places disponibles." },
    { question: "L'inscription est-elle gratuite ?", answer: "Oui, l'inscription au SANE est entièrement gratuite pour les visiteurs et demandeurs d'emploi." },
    { question: "Recevrai-je une confirmation de mon inscription ?", answer: "Oui, un email de confirmation vous sera envoyé avec votre badge d'accès et les détails pratiques de votre participation." },
  ],
  formations: [
    { question: "Quelles formations sont proposées ?", answer: "Le SANE propose des formations dans divers domaines : numérique, entrepreneuriat, langues, compétences techniques, développement personnel et leadership." },
    { question: "Comment choisir la formation adaptée ?", answer: "Consultez notre catalogue de formations en ligne et utilisez les filtres par domaine, niveau et durée pour trouver la formation qui correspond à vos besoins." },
    { question: "Les formations sont-elles certifiantes ?", answer: "Certaines formations délivrent des certificats reconnus. Les détails sont précisés dans la description de chaque formation." },
    { question: "Qui sont les formateurs ?", answer: "Nos formateurs sont des experts reconnus dans leurs domaines respectifs, issus d'entreprises, d'universités et d'organisations internationales." },
    { question: "Puis-je suivre une formation en ligne ?", answer: "Oui, certaines formations sont disponibles en format hybride ou entièrement en ligne. Consultez le programme pour les options disponibles." },
  ],
  emploi: [
    { question: "Comment accéder aux offres d'emploi ?", answer: "Les offres d'emploi sont disponibles dans la section 'Emploi' de notre site. Vous pouvez filtrer par secteur, localisation et type de contrat." },
    { question: "Les entreprises recrutent-elles sur place ?", answer: "Oui, de nombreuses entreprises effectuent des entretiens et du recrutement directement pendant le salon." },
    { question: "Puis-je déposer mon CV en ligne ?", answer: "Oui, vous pouvez créer votre profil et déposer votre CV sur notre plateforme pour être visible par les recruteurs." },
    { question: "Y a-t-il un accompagnement pour les jeunes ?", answer: "Oui, des conseillers en insertion professionnelle sont disponibles pour accompagner les jeunes dans leur recherche d'emploi et leur orientation." },
    { question: "Les offres sont-elles accessibles après le salon ?", answer: "Oui, les offres d'emploi restent disponibles sur notre plateforme en ligne après l'événement." },
  ],
  partenaires: [
    { question: "Comment devenir partenaire du SANE ?", answer: "Contactez-nous via notre formulaire de partenariat ou écrivez-nous à partenaires@sane.ne pour discuter des modalités de collaboration." },
    { question: "Quels sont les avantages du partenariat ?", answer: "Les partenaires bénéficient d'une visibilité accrue, d'un accès privilégié aux talents, et contribuent directement au développement de l'emploi au Niger." },
    { question: "Quels types de partenariats proposez-vous ?", answer: "Nous proposons des partenariats institutionnels, financiers, techniques et médiatiques, adaptés aux objectifs de chaque organisation." },
    { question: "Les ONG peuvent-elles participer ?", answer: "Oui, les ONG et organisations de la société civile sont les bienvenues en tant que partenaires ou exposants." },
    { question: "Comment sponsoriser un événement spécifique ?", answer: "Contactez notre équipe partenariats pour découvrir les opportunités de sponsoring disponibles pour les différents événements du SANE." },
  ],
};

/* ─────────────────────────────── ACCORDION ─────────────────────────────── */

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#DDE8E0]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-[14px] font-semibold text-[#0a2e16] transition-colors hover:text-[#10632D]"
      >
        <span>{q}</span>
        {open ? <Minus size={18} className="shrink-0 text-[#10632D]" /> : <Plus size={18} className="shrink-0 text-[#61756B]" />}
      </button>
      {open && (
        <div className="pb-4 text-[13px] leading-relaxed text-[#61756B]">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────── PAGE ─────────────────────────────── */

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("generalites");

  const leftCategories = ["generalites", "formations"];
  const rightCategories = ["inscriptions", "emploi"];

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
              alt="FAQ SANE"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a4a22] via-[#0a4a22]/40 to-transparent" />
          </div>

          {/* floating card top-right */}
          <div className="absolute right-8 top-20 z-20 hidden rounded-lg border border-white/20 bg-[#E57617] px-4 py-3 text-[11px] font-bold leading-snug text-white lg:block">
            EMPLOI<br/>FORMATION<br/>OPPORTUNITÉS<br/>AVENIR
          </div>

          {/* italic text right */}
          <div className="absolute right-8 bottom-16 z-20 hidden text-right lg:block">
            <p className="font-serif text-[18px] italic leading-snug text-white/80">
              Des réponses<br/>pour un Niger<br/>plus fort
            </p>
          </div>

          <div className="sane-container relative z-20 flex min-h-[480px] flex-col justify-center py-16">
            <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={14} />
              <span className="text-white">FAQ</span>
            </nav>

            <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest text-white/60">SALON NATIONAL DE L'EMPLOI</p>

            <div className="max-w-[520px]">
              <h1 className="mb-2 text-5xl font-extrabold text-white lg:text-6xl">FAQ</h1>
              <p className="mb-4 text-xl font-bold text-[#E57617]">Vos questions, nos réponses</p>
              <p className="mb-8 text-[14px] leading-relaxed text-white/75 max-w-[440px]">
                Retrouvez ici les réponses aux questions les plus fréquentes sur le Salon National de l'Emploi, son programme, les formations, les inscriptions et la participation.
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
                <div key={i} className="flex items-center gap-3 py-7 px-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E57617]/10 text-[#E57617]">
                    {s.icon}
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-[#0a2e16]">{s.value}</span>
                    <span className="text-[12px] text-[#61756B]">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. CATEGORY TABS ═══════════════════ */}
        <section className="bg-[#F5F9F6] py-14">
          <div className="sane-container">
            <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#E57617]">
              <span className="h-px w-6 bg-[#E57617]" />
              PARCOURIR PAR THÉMATIQUE
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#0a2e16] lg:text-3xl">
              Trouvez rapidement votre réponse
            </h2>
            <p className="mb-8 text-[14px] text-[#61756B]">
              Sélectionnez une catégorie pour voir les questions associées.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  className={`group flex flex-col gap-2 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                    activeTab === cat.key
                      ? "border-[#10632D] bg-[#10632D] text-white shadow-lg"
                      : "border-[#DDE8E0] bg-white text-[#0a2e16] hover:border-[#10632D]/30 hover:shadow-md"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${
                    activeTab === cat.key ? "bg-white/20" : "bg-[#F5F9F6]"
                  }`}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold">{cat.title}</p>
                    <p className={`text-[12px] ${activeTab === cat.key ? "text-white/70" : "text-[#61756B]"}`}>
                      {cat.subtitle}
                    </p>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      activeTab === cat.key
                        ? "bg-white/20 text-white"
                        : "border border-[#DDE8E0] text-[#61756B]"
                    }`}>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ 4. FAQ ACCORDION (2-COLUMN) ═══════════════════ */}
        <section className="bg-white py-16">
          <div className="sane-container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* left column */}
              <div className="flex flex-col gap-12">
                {leftCategories.map((catKey) => {
                  const cat = categories.find((c) => c.key === catKey)!;
                  const questions = faqData[catKey] || [];
                  return (
                    <div key={catKey}>
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10632D] text-lg text-white">
                          {cat.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-px w-4 bg-[#E57617]" />
                            <p className="text-[12px] font-bold uppercase tracking-wider text-[#0a2e16]">{cat.title}</p>
                          </div>
                          <p className="text-[12px] text-[#61756B]">{cat.subtitle}</p>
                        </div>
                      </div>
                      <div>
                        {questions.map((faq, j) => (
                          <AccordionItem key={j} q={faq.question} a={faq.answer} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* right column */}
              <div className="flex flex-col gap-12">
                {rightCategories.map((catKey) => {
                  const cat = categories.find((c) => c.key === catKey)!;
                  const questions = faqData[catKey] || [];
                  return (
                    <div key={catKey}>
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10632D] text-lg text-white">
                          {cat.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-px w-4 bg-[#E57617]" />
                            <p className="text-[12px] font-bold uppercase tracking-wider text-[#0a2e16]">{cat.title}</p>
                          </div>
                          <p className="text-[12px] text-[#61756B]">{cat.subtitle}</p>
                        </div>
                      </div>
                      <div>
                        {questions.map((faq, j) => (
                          <AccordionItem key={j} q={faq.question} a={faq.answer} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 5. CTA ═══════════════════ */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
