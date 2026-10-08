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
    iconStyle: "bg-[var(--sane-green)] text-white",
  },
  {
    title: "Je recrute",
    description: "Publiez vos offres et trouvez les meilleurs talents.",
    href: "/recruteur",
    icon: UsersRound,
    iconStyle: "bg-[var(--sane-orange)] text-white",
  },
  {
    title: "Je participe",
    description: "Inscrivez-vous au Salon National de l'Emploi du Niger (SANEM).",
    href: "/inscription",
    icon: CalendarDays,
    iconStyle: "bg-[var(--sane-green)] text-white",
  },
  {
    title: "Je me forme",
    description: "Découvrez les formations disponibles.",
    href: "/formations",
    icon: GraduationCap,
    iconStyle: "bg-[var(--sane-orange)] text-white",
  },
];

export function QuickActions() {
  return (
    <section className="relative z-10 mt-0 pb-10 sm:-mt-6">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col justify-between rounded-xl border border-[var(--sane-c-e0e9e3)] bg-white p-5 shadow-[0_8px_30px_rgba(16,99,45,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(16,99,45,0.13)]"
              >
                <div>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconStyle}`}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  <h3 className="sane-h3 mt-5">
                    {action.title}
                  </h3>

                  <p className="sane-body mt-2">
                    {action.description}
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--sane-c-d7e5db)] text-[var(--sane-green)] transition-all group-hover:border-[var(--sane-green)] group-hover:bg-[var(--sane-green)] group-hover:text-white">
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}