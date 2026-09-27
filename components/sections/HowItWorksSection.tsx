import {
  UserRound,
  UsersRound,
  CalendarCheck2,
  MapPinned,
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
    <section className="bg-white py-12 md:py-14">
      <Container>

        {/* HEADING */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-[3px] w-6 rounded-full bg-[#E57617]" />

            <span className="text-xs font-bold uppercase tracking-wide text-[#10632D]">
              Comment ça marche ?
            </span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#10632D] md:text-4xl">
            Un processus simple pour plus d&apos;opportunités
          </h2>
        </div>

        {/* STEPS */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="flex items-start gap-4"
              >
                {/* ICON */}
                <div
                  className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full text-white ${
                    step.orange
                      ? "bg-[#E57617]"
                      : "bg-[#10632D]"
                  }`}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>

                {/* CONTENT */}
                <div className="min-w-0">

                  {/* NUMBER */}
                  <div className="text-base font-bold text-[#9BB0A3]">
                    {step.number}
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-1 text-sm font-extrabold leading-5 text-[#17352A]">
                    {step.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-1.5 max-w-[190px] text-xs leading-5 text-[#718178]">
                    {step.description}
                  </p>

                </div>
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
}