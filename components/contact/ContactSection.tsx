import { Container } from "@/components/ui/Container";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";

/** Form on the left, contact details on the right. */
export function ContactSection() {
  return (
    <section id="contact-form" className="scroll-mt-20 bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <ContactForm />
          <ContactInfo />
        </div>
      </Container>
    </section>
  );
}
