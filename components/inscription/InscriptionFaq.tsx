import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { AccordionList } from "@/components/shared";
import { faqs } from "./data";

export function InscriptionFaq() {
  const half = Math.ceil(faqs.length / 2);

  return (
    <section className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions fréquentes"
            description="Trouvez des réponses aux questions les plus courantes sur l'inscription."
          />
          <Link href="/faq" className={`${textLink} hidden shrink-0 sm:inline-flex`}>
            Voir toutes les questions <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
          <AccordionList items={faqs.slice(0, half)} />
          <AccordionList items={faqs.slice(half)} />
        </div>

        <Link href="/faq" className={`${textLink} mt-6 sm:hidden`}>
          Voir toutes les questions <ArrowRight size={14} />
        </Link>
      </Container>
    </section>
  );
}
