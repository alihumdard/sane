import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "./data";

export function TestimonialsSection() {
  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading eyebrow="Témoignages" title="Témoignages de nos partenaires" className="mb-8 sm:mb-10" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
          {testimonials.map(({ quote, name, role, photo, icon: Icon }) => (
            <figure
              key={name}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--sane-green)]/25 hover:shadow-lg"
            >
              <div className="flex flex-1 flex-col gap-4 p-6">
                <Quote
                  size={28}
                  strokeWidth={2.5}
                  className="shrink-0 text-[var(--sane-orange)]/35"
                  fill="currentColor"
                />
                <blockquote className="sane-small flex-1 italic leading-relaxed text-[var(--sane-text)]">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </div>

              <figcaption className="flex items-center gap-3 border-t border-[var(--sane-border)] bg-[var(--sane-background)]/60 px-6 py-4">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
                  <Image src={photo} alt={name} fill sizes="44px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[length:var(--fs-body)] font-bold text-[var(--sane-text)]">{name}</p>
                  <p className="sane-small flex items-center gap-1.5 truncate">
                    <Icon size={13} className="shrink-0 text-[var(--sane-green)]" />
                    {role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
