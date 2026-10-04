import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "./data";

export function TestimonialsSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading eyebrow="Témoignages" title="Témoignages de nos partenaires" className="mb-8 sm:mb-10" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(({ quote, name, role, photo, icon: Icon }) => (
            <figure
              key={name}
              className="flex flex-col overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex gap-4 p-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image src={photo} alt={name} fill sizes="96px" className="object-cover" />
                </div>
                <blockquote className="sane-small italic">&ldquo;{quote}&rdquo;</blockquote>
              </div>

              <figcaption className="mt-auto flex items-center gap-3 border-t border-[var(--sane-border)] px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--sane-border)] bg-[var(--sane-background)] text-[var(--sane-green)]">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-[length:var(--fs-body)] font-semibold text-[var(--sane-text)]">{name}</p>
                  <p className="sane-small">{role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
