import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { primaryBtn } from "@/components/ui/styles";
import { impactStats } from "./data";

export function ImpactSection() {
  return (
    <section className="bg-[var(--sane-green-deep)] py-10 sm:py-12 md:py-14">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="lg:max-w-[360px] lg:shrink-0">
            <SectionHeading
              tone="light"
              title="L'impact de nos partenaires"
              description="Grâce à nos partenaires, nous multiplions les opportunités et contribuons à un écosystème de l'emploi plus inclusif et durable au Niger."
              className="mb-7"
            />
            <Link href="/contact" className={primaryBtn}>
              Rejoindre nos partenaires <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 lg:flex-1">
            {impactStats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white">
                  <Icon size={20} />
                </span>
                <span className="text-[length:var(--fs-h1)] font-extrabold leading-none text-white">{value}</span>
                <span className="sane-small on-dark">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
