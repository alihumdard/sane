import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { mediaLogos } from "./data";

export function MediaMentionsSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Ils parlent du SANEM" title="Le SANEM dans les médias" />
          <Link href="#" className={`${textLink} whitespace-nowrap`}>
            Voir toutes les mentions <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 min-[480px]:grid-cols-3 lg:grid-cols-6">
          {mediaLogos.map((m) => (
            <div
              key={m.name}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--sane-border)] bg-white p-5 text-center transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-[length:var(--fs-lead)] font-extrabold tracking-tight" style={{ color: m.color }}>
                {m.name}
              </span>
              {m.subtitle && <span className="sane-small text-[11px] leading-tight">{m.subtitle}</span>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
