import Image from "next/image";
import { Quote, Briefcase, GraduationCap, Handshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "./data";

const decorIcons = [Briefcase, Handshake, GraduationCap];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--sane-background)] py-12 sm:py-16 md:py-20">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[var(--sane-green)]/[0.05] blur-2xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[var(--sane-orange)]/[0.06] blur-2xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.035]" aria-hidden="true">
          <pattern id="partners-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="var(--sane-green)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#partners-grid)" />
        </svg>
      </div>

      <Container className="relative">
        <SectionHeading eyebrow="Témoignages" title="Témoignages de nos partenaires" className="mb-10 sm:mb-14" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-5">
          {testimonials.map(({ quote, name, role, photo, icon: Icon }, i) => {
            const Decor = decorIcons[i % decorIcons.length];
            const featured = i === 1;

            return (
              <figure
                key={name}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white transition-all duration-300 ${
                  featured
                    ? "border border-[var(--sane-green)]/15 shadow-[0_20px_45px_-15px_rgba(16,99,45,0.25)] lg:-translate-y-3 lg:scale-[1.04] lg:hover:-translate-y-4"
                    : "border border-[var(--sane-border)] shadow-sm hover:-translate-y-1.5 hover:shadow-[0_18px_35px_-18px_rgba(16,99,45,0.18)]"
                }`}
              >
                {/* top accent bar */}
                <div
                  className={`h-[3px] w-full ${
                    featured
                      ? "bg-gradient-to-r from-[var(--sane-green)] via-[var(--sane-orange)] to-[var(--sane-green)]"
                      : "bg-gradient-to-r from-[var(--sane-green)]/20 to-[var(--sane-orange)]/20"
                  }`}
                />

                {/* decorative watermark icon */}
                <Decor
                  size={88}
                  strokeWidth={1}
                  className="pointer-events-none absolute -right-4 -top-2 text-[var(--sane-green)]/[0.045]"
                />

                <div className="relative flex flex-1 flex-col gap-5 p-7 sm:p-8">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      featured ? "bg-[var(--sane-orange)] text-white shadow-md shadow-[var(--sane-orange)]/25" : "bg-[var(--sane-orange-light)] text-[var(--sane-orange)]"
                    }`}
                  >
                    <Quote size={20} strokeWidth={2.2} fill="currentColor" />
                  </span>

                  <blockquote
                    className={`flex-1 italic leading-relaxed text-[var(--sane-text)] ${
                      featured ? "text-[15px] sm:text-[16px]" : "sane-small"
                    }`}
                  >
                    &ldquo;{quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3.5 border-t border-[var(--sane-border)] pt-5">
                    <div
                      className={`relative shrink-0 overflow-hidden rounded-full ring-[3px] shadow-md ${
                        featured ? "h-16 w-16 ring-[var(--sane-orange)]/20" : "h-[52px] w-[52px] ring-white"
                      }`}
                    >
                      <Image src={photo} alt={name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[length:var(--fs-body)] font-extrabold text-[var(--sane-text)]">{name}</p>
                      <p className="sane-small mt-0.5 flex items-center gap-1.5 truncate font-medium text-[var(--sane-green)]">
                        <Icon size={13} className="shrink-0" />
                        {role}
                      </p>
                    </div>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
