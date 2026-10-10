import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { recruitingPartners } from "./data";

export function PartnersSection() {
  return (
    <section className="bg-[var(--sane-background)] pb-10 pt-2 sm:pb-12 md:pb-16">
      <Container>
        <div className="mb-0.5 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
            Nos partenaires qui recrutent
          </span>
        </div>
        <h2 className="sane-h2 mb-6">
          Ils nous font confiance
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {recruitingPartners.map((p) => (
            <div
              key={p.abbr}
              className="group flex flex-col items-center justify-center gap-2.5 rounded-xl border border-[var(--sane-border)] bg-white px-3 py-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:px-4 sm:py-5"
            >
              <div className="relative h-12 w-full sm:h-14">
                <Image
                  src={p.logo}
                  alt={p.name}
                  fill
                  sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain"
                />
              </div>
              <span className="text-center text-[10px] font-semibold leading-tight text-[var(--sane-text-light)] sm:text-[11px]">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
