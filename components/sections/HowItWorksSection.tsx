import {
  UserRound,
  UsersRound,
  CalendarCheck2,
  MapPinned,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    number: "01",
    title: "Créez votre profil",
    description: "Inscrivez-vous et complétez votre profil.",
    icon: UserRound,
    orange: false,
  },
  {
    number: "02",
    title: "Découvrez les opportunités",
    description: "Accédez aux offres d'emploi et formations.",
    icon: UsersRound,
    orange: true,
  },
  {
    number: "03",
    title: "Connectez-vous aux recruteurs",
    description: "Postulez et échangez avec les entreprises.",
    icon: CalendarCheck2,
    orange: false,
  },
  {
    number: "04",
    title: "Organisez votre entretien",
    description: "Planifiez vos entretiens et suivez votre progression.",
    icon: MapPinned,
    orange: true,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-[#F8FBF9] py-14 md:py-16">
      <Container>

        {/* HEADING */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-[3px] w-6 rounded-full bg-[#E57617]" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#10632D]">
              Comment ça marche ?
            </span>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#10632D] md:text-4xl">
            Un processus simple pour plus d&apos;opportunités
          </h2>
        </div>

        {/* STEPS */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative flex flex-col items-start">
                {/* Arrow connector — hidden on last item and on mobile */}
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-6 hidden translate-x-1/2 text-[#D4E1D8] lg:block">
                    <ArrowRight size={20} />
                  </div>
                )}

                {/* Icon + Number row */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white sm:h-[52px] sm:w-[52px] ${
                      step.orange ? "bg-[#E57617]" : "bg-[#10632D]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} className="sm:!h-[22px] sm:!w-[22px]" />
                  </div>

                  <span className={`text-[18px] font-extrabold sm:text-[22px] ${
                    step.orange ? "text-[#E57617]" : "text-[#10632D]"
                  }`}>
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-[15px] font-extrabold leading-5 text-[#17352A]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-[13px] leading-5 text-[#718178]">
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
