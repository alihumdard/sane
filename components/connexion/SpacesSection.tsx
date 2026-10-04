import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { roles } from "./data";

interface Props {
  onSelectRole: (key: string) => void;
}

export function SpacesSection({ onSelectRole }: Props) {
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
              <h3 className="sane-h3 mb-2">{title}</h3>
              <p className="sane-small mb-4 flex-1">{desc}</p>
              <a href="#login-form" onClick={() => onSelectRole(key)} className={textLink}>
                Se connecter <ArrowRight size={13} />
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
