import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RegistrationWizard } from "./RegistrationWizard";
import { RegistrationSidebar } from "./RegistrationSidebar";

/** Wizard on the left, practical info on the right (same height). */
export function RegistrationSection() {
  return (
    <section id="form" className="scroll-mt-20 bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Inscription"
          title="Créez votre compte participant"
          description="Remplissez le formulaire ci-dessous pour vous inscrire au Salon National de l'Emploi."
          className="mb-8"
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          <RegistrationWizard />
          <RegistrationSidebar />
        </div>
      </Container>
    </section>
  );
}
