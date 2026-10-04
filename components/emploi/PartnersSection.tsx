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
              className="relative flex h-[76px] w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white px-3 py-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:h-[88px] sm:px-4"
            >
              <Image
                src={p.logo}
                alt={p.name}
                fill
                sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain p-3"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
