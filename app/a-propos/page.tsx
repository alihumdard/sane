import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import {
  HeroBanner,
  StatsBar,
  VisionSection,
  MissionVisionValues,
  ImpactSection,
  ProjectSection,
  TeamSection,
} from "@/components/a-propos";

export default function AProposPage() {
  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <StatsBar />
        <VisionSection />
        <MissionVisionValues />
        <ImpactSection />
        <ProjectSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
