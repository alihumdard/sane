import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReinitialiserMotDePasseCard } from "@/components/connexion/ReinitialiserMotDePasseCard";

export const metadata = { title: "Réinitialiser le mot de passe — SANEM" };

export default function ReinitialiserMotDePassePage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--sane-background)] py-14 sm:py-20">
        <div className="mx-auto flex max-w-[460px] items-center justify-center px-4">
          {/* useSearchParams() opts the page out of prerendering unless it
              sits behind a Suspense boundary, same as the login page. */}
          <Suspense
            fallback={
              <div className="flex min-h-[320px] items-center justify-center">
                <Loader2 size={22} className="animate-spin text-[var(--sane-green)]" />
              </div>
            }
          >
            <ReinitialiserMotDePasseCard />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
