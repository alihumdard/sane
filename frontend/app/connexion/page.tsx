import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/sections/CTASection";
import { ConnexionContent } from "@/components/connexion";

export default function ConnexionPage() {
  return (
    <>
      <Header />
      <main>
        {/*
          The login card reads ?suite= to return the visitor where they came
          from, and useSearchParams() opts a page out of prerendering unless
          it sits behind a Suspense boundary.
        */}
        <Suspense
          fallback={
            <div className="flex min-h-[420px] items-center justify-center">
              <Loader2 size={22} className="animate-spin text-[var(--sane-green)]" />
            </div>
          }
        >
          <ConnexionContent />
        </Suspense>
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
