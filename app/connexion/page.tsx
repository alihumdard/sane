import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ConnexionContent } from "@/components/connexion";

export default function ConnexionPage() {
  return (
    <>
      <Header />
      <main>
        <ConnexionContent />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
