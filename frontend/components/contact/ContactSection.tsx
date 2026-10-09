import { Container } from "@/components/ui/Container";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";

/** Form on the left, contact details card on the right. */
export function ContactSection() {
  return (
    <section id="contact-form" className="scroll-mt-20 bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <div className="grid items-stretch gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-8 lg:gap-10">
          <ContactForm />
          <div className="rounded-2xl border border-[var(--sane-border)] bg-white p-6 shadow-sm sm:p-8">
            <ContactInfo />
          </div>
        </div>
      </Container>
    </section>
  );
}
