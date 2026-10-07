import { Download } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { documents } from "./data";

export function DocumentsSection() {
  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Ressources"
          title="Documents utiles"
          description="Téléchargez les documents officiels du SANEM."
        />

        <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:mt-8 md:grid-cols-3">
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
              <a
                key={doc.title}
                href={doc.href}
                className="group flex items-center gap-4 rounded-2xl border border-[var(--sane-border)] bg-white p-4 transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--sane-green-light)] sm:h-12 sm:w-12">
                  <Icon size={21} strokeWidth={2} className="text-[var(--sane-green)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold text-[var(--sane-text)] sm:text-[14px]">
                    {doc.title}
                  </p>
                  <p className="sane-small">{doc.format}</p>
                </div>
                <Download
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-[var(--sane-orange)] transition-transform group-hover:translate-y-0.5"
                />
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
