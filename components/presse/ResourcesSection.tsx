import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pressResources } from "./data";

export function ResourcesSection() {
  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading eyebrow="Ressources médias" title="Téléchargez nos ressources" className="mb-8 sm:mb-10" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pressResources.map(({ icon: Icon, color, title, description, button }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-[var(--sane-border)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
                <Icon size={22} />
              </span>
              <h3 className="sane-h3 mb-2">{title}</h3>
              <p className="sane-small mb-5 flex-1">{description}</p>
              <Link
                href="#"
                className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-[var(--sane-border)] px-4 py-2 text-[length:var(--fs-small)] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]"
              >
                {button} <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
