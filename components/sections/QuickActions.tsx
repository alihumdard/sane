import Link from "next/link";
import {
  BriefcaseBusiness,
  UsersRound,
  CalendarDays,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const actions = [
  {
    title: "Je cherche un emploi",
    description: "Trouvez des opportunités adaptées à votre profil.",
    href: "/emploi",
    icon: BriefcaseBusiness,
    iconStyle: "bg-[#10632D] text-white",
  },
  {
    title: "Je recrute",
    description: "Publiez vos offres et trouvez les meilleurs talents.",
    href: "/recruteur",
    icon: UsersRound,
    iconStyle: "bg-[#E57617] text-white",
  },
  {
    title: "Je participe",
    description: "Inscrivez-vous au Salon National de l'Emploi.",
    href: "/inscription",
    icon: CalendarDays,
    iconStyle: "bg-[#10632D] text-white",
  },
  {
    title: "Je me forme",
    description: "Découvrez les formations disponibles.",
    href: "/formations",
    icon: GraduationCap,
    iconStyle: "bg-[#E57617] text-white",
  },
];

export function QuickActions() {
  return (
    <section className="relative z-10 -mt-8 pb-10">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-xl border border-[#E0E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(16,99,45,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(16,99,45,0.13)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconStyle}`}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7E5DB] text-[#10632D] transition-all group-hover:border-[#10632D] group-hover:bg-[#10632D] group-hover:text-white">
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </div>

                <h3 className="mt-5 text-base font-extrabold text-[#17352A]">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-5 text-[#61756B]">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}