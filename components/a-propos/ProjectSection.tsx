import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, Handshake, Landmark } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const cards = [
  {
    title: "Pour les demandeurs d’emploi",
    icon: BriefcaseBusiness,
    href: "/inscription",
    items: [
      "Trouver des opportunités",
      "Développer vos compétences",
      "Rencontrer des recruteurs",
      "Construire votre avenir",
    ],
  },
  {
    title: "Pour les entreprises",
    icon: Building2,
    href: "/contact",
    items: [
      "Accéder à un vivier de talents",
      "Promouvoir vos offres",
      "Renforcer votre marque employeur",
      "Contribuer au développement du Niger",
    ],
  },
  {
    title: "Pour les partenaires",
    icon: Handshake,
    href: "/partenaires",
    items: [
      "Soutenir l’emploi des jeunes",
      "Coopérer avec le SANE",
      "Construire un développement durable",
    ],
  },
  {
    title: "Pour les institutions",
    icon: Landmark,
    href: "/contact",
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
        <SectionHeading
          eyebrow="Notre Projet"
          title="Un engagement global pour l'emploi"
          className="mb-8 sm:mb-10"
        />

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-3.5 rounded-2xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-5 transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sane-green)] sm:h-11 sm:w-11">
                <card.icon size={20} strokeWidth={2} className="text-white" />
              </div>
              <h3 className="sane-h3">{card.title}</h3>
              <ul className="flex flex-col gap-2">
                {card.items.map((item) => (
                  <li key={item} className="sane-small flex items-start gap-2">
                    <CheckCircle2 size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-[var(--sane-orange)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  href={card.href}
                  aria-label={card.title}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--sane-border)] text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green)] hover:!text-white"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
