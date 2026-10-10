import {
  UserRound,
  UsersRound,
  CalendarCheck2,
  MapPinned,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Créez votre profil",
    description: "Inscrivez-vous et complétez votre profil professionnel en quelques minutes.",
    icon: UserRound,
    orange: false,
  },
  {
    number: "02",
    title: "Découvrez les opportunités",
    description: "Accédez aux offres d'emploi, formations et événements disponibles.",
    icon: UsersRound,
    orange: true,
  },
  {
    number: "03",
    title: "Connectez-vous aux recruteurs",
    description: "Postulez et échangez directement avec les entreprises qui recrutent.",
    icon: CalendarCheck2,
    orange: false,
  },
  {
    number: "04",
    title: "Organisez votre entretien",
    description: "Planifiez vos entretiens et suivez l'état de votre candidature.",
    icon: MapPinned,
    orange: true,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-[var(--sane-background)] py-14 md:py-16">
      <Container>

        {/* HEADING */}
        <SectionHeading
          eyebrow="Comment ça marche ?"
          title="Un processus simple en 4 étapes"
          className="mb-10"
        />

        {/* STEPS */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative flex flex-col">
                {/* Arrow connector — hidden on last item and on mobile */}
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-7 hidden translate-x-1/2 text-[var(--sane-c-d4e1d8)] md:block">
                    <ArrowRight size={20} />
                  </div>
                )}

                {/* Icon + Number row */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white sm:h-[52px] sm:w-[52px] ${
                      step.orange ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-green)]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} className="sm:!h-[22px] sm:!w-[22px]" />
                  </div>

                  <span className={`text-[18px] font-extrabold sm:text-[22px] ${
                    step.orange ? "text-[var(--sane-orange)]" : "text-[var(--sane-green)]"
                  }`}>
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="sane-h3 mt-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="sane-small mt-2">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
}
