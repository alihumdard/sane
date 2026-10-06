import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { documents } from "./data";

export function DocumentsSection() {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Documents requis"
          title="Préparez vos documents"
          description="Préparez les documents suivants pour compléter votre inscription."
          className="mb-8"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {documents.map(({ icon: Icon, title, desc, format, color }) => (
            <div key={title} className="rounded-2xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-5">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
                <Icon size={22} />
              </span>
              <h3 className="sane-h3 mb-1">{title}</h3>
              <p className="sane-small">{desc}</p>
              <p className="sane-small mt-1 opacity-80">{format}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
