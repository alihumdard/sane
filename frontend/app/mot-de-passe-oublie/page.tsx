import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotDePasseOublieCard } from "@/components/connexion/MotDePasseOublieCard";

export const metadata = { title: "Mot de passe oublié — SANEM" };

export default function MotDePasseOubliePage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--sane-background)] py-14 sm:py-20">
        <div className="mx-auto flex max-w-[460px] items-center justify-center px-4">
          <MotDePasseOublieCard />
        </div>
      </main>
      <Footer />
    </>
  );
}
