import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AccordionList } from "@/components/shared";
import { faqs } from "./data";

export function FaqSection() {
  const entries = faqs.map((f) => ({ question: f.q, answer: f.a }));
  const half = Math.ceil(entries.length / 2);

  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading eyebrow="Questions fréquentes" title="FAQ – Formations" className="mb-8" />

        <div className="grid gap-x-8 lg:grid-cols-2">
          <AccordionList items={entries.slice(0, half)} />
          <AccordionList items={entries.slice(half)} />
        </div>
      </Container>
    </section>
  );
}
