import { Container } from "@/components/ui/Container";
import { recruitingPartners } from "./data";

export function PartnersSection() {
  return (
    <section className="bg-[var(--sane-background)] py-12 sm:py-14">
      <Container>
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
            Nos partenaires qui recrutent
          </span>
        </div>
        <h2 className="mb-8 text-[24px] font-extrabold text-[#0f5025] md:text-[32px]">
          Ils nous font confiance
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {recruitingPartners.map((p) => (
            <div key={p.abbr} className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--sane-border)] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="text-[18px] font-extrabold" style={{ color: p.color }}>{p.abbr}</span>
              <span className="text-center text-[11px] leading-tight text-[var(--sane-text-light)]">{p.name}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
