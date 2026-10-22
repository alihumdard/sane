import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { roles } from "./data";

export function SpacesSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Nos espaces"
          title="Accédez aux différents espaces"
          description="Chaque profil dispose d'un espace dédié avec des fonctionnalités adaptées."
          className="mb-8"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map(({ key, title, icon: Icon, desc, color }) => (
            <div
              key={key}
              className="flex flex-col rounded-2xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
                <Icon size={24} />
              </span>
              <div className="mb-2 flex w-full items-center justify-between gap-2">
                <h3 className="sane-h3">{title}</h3>
                <a
                  href="#login-form"
                  aria-label={`Se connecter — ${title}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--sane-border)] text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green)] hover:text-white"
                >
                  <ArrowRight size={14} />
                </a>
              </div>
              <p className="sane-small flex-1">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
