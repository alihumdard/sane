import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { QuickActions } from "@/components/sections/QuickActions";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { JobsSection } from "@/components/sections/JobsSection";
import { TrainingSection } from "@/components/sections/TrainingSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FeatureLinksSection } from "@/components/sections/FeatureLinksSection";
import { CTASection } from "@/components/sections/CTASection";
export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <QuickActions />

        <CountdownSection />

        <AboutSection />

        <JobsSection />

        <TrainingSection />

        <HowItWorksSection />

        <FeatureLinksSection />

        <CTASection />
        
      </main>

      <Footer />
    </>
  );
}