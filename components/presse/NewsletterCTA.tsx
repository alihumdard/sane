import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/shared";

export function NewsletterCTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--sane-green-dark)]">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 lg:block">
        <Image src="/sane_deal.png" alt="" fill sizes="33vw" className="object-cover object-center opacity-40" />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--sane-green-dark)] via-[var(--sane-green-dark)] to-[var(--sane-green-dark)]/80" />

      <Container className="relative z-20 py-10 sm:py-12">
        <div className="max-w-[520px]">
          <SectionHeading
            tone="light"
            eyebrow="Newsletter presse"
            title="Recevez nos actualités presse"
            description="Abonnez-vous pour recevoir nos communiqués et les dernières nouvelles du SANE."
            className="mb-6"
          />
          <NewsletterForm layout="inline" tone="dark" successMessage="Merci ! Vous êtes abonné(e) à nos actualités presse." />
        </div>
      </Container>
    </section>
  );
}
