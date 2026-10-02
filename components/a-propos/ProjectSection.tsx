import { ArrowRight, BriefcaseBusiness, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

const cards = [
  {
    title: "Pour les demandeurs d’emploi",
    items: [
      "Trouver des opportunités",
      "Développer vos compétences",
      "Rencontrer des recruteurs",
      "Construire votre avenir",
    ],
  },
  {
    title: "Pour les entreprises",
    items: [
      "Accéder à un vivier de talents",
      "Promouvoir vos offres",
      "Renforcer votre marque employeur",
      "Contribuer au développement du Niger",
    ],
  },
  {
    title: "Pour les partenaires",
    items: [
      "Soutenir l’emploi des jeunes",
      "Coopérer avec le SANE",
      "Construire un développement durable",
    ],
  },
  {
    title: "Pour les institutions",
    items: [
      "Mettre en œuvre les politiques d’emploi",
      "Renforcer les compétences nationales",
      "Impulser des initiatives durables",
    ],
  },
];

export function ProjectSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="h-[3px] w-8 rounded-full bg-[var(--sane-orange)]" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--sane-green)] sm:text-[11px]">
            Notre Projet
          </span>
        </div>

        <h2 className="mb-8 text-[22px] font-extrabold leading-[1.12] tracking-tight text-[var(--sane-text)] sm:mb-10 sm:text-[26px] md:text-[30px]">
          Un engagement global pour l&apos;emploi
        </h2>

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-3.5 rounded-2xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-5 transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sane-green)] sm:h-11 sm:w-11">
                <BriefcaseBusiness size={20} strokeWidth={2} className="text-white" />
              </div>
              <h3 className="text-[14px] font-extrabold text-[var(--sane-text)] sm:text-[15px]">{card.title}</h3>
              <ul className="flex flex-col gap-2">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12px] leading-snug text-[var(--sane-text-light)] sm:text-[13px]">
                    <CheckCircle2 size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-[var(--sane-orange)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--sane-border)] text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green)] hover:text-white">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
