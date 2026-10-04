import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { partnerTypes } from "./data";

export function PartnerTypesSection() {
  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading eyebrow="Nos types de partenaires" title="Des collaborations au service de l'emploi" className="mb-8 sm:mb-10" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partnerTypes.map(({ icon: Icon, title, items, color }) => (
            <div
              key={title}
              className="group flex flex-col rounded-2xl border border-[var(--sane-border)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
                <Icon size={22} />
              </span>
              <h3 className="sane-h3 mb-4">{title}</h3>
              <ul className="flex flex-1 flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item} className="sane-small flex items-start gap-2">
                    <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--sane-green)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end">
                <Link
                  href="/contact"
                  aria-label={`Devenir partenaire — ${title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--sane-green)] text-[var(--sane-green)] transition-colors group-hover:bg-[var(--sane-green)] group-hover:text-white"
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
