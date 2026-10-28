import Link from "next/link";
import { ArrowLeft, Briefcase, CalendarDays, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { primaryBtn, textLink } from "@/components/ui/styles";

/**
 * The page shown when an address leads nowhere.
 *
 * It was the framework's own: a bare white page reading "404" and "This page
 * could not be found", in English, with no header, no footer and no way back
 * into a French site.
 */
export default function PageIntrouvable() {
  return (
    <>
      <Header />

      <main className="bg-[var(--sane-background)] py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-[560px] text-center">
            <p className="mb-2 text-[56px] font-extrabold leading-none text-[var(--sane-green)] sm:text-[72px]">
              404
            </p>
            <h1 className="sane-h2 mb-3">Cette page n&apos;existe pas</h1>
            <p className="sane-body mb-8">
              Le lien est peut-être erroné, ou la page a été retirée. Voici par où
              reprendre.
            </p>

            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className={primaryBtn}>
                <ArrowLeft size={16} /> Retour à l&apos;accueil
              </Link>
              <Link href="/contact" className={textLink}>
                Nous signaler ce lien
              </Link>
            </div>

            <div className="grid gap-3 text-left sm:grid-cols-3">
              {[
                { href: "/emploi", icon: Briefcase, titre: "Offres d'emploi", texte: "Consulter et postuler" },
                { href: "/formations", icon: CalendarDays, titre: "Formations", texte: "Programmes gratuits" },
                { href: "/programme", icon: Search, titre: "Programme", texte: "Les trois journées" },
              ].map(({ href, icon: Icone, titre, texte }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col gap-1 rounded-2xl border border-[var(--sane-border)] bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <Icone size={18} className="text-[var(--sane-orange)]" />
                  <span className="text-[14px] font-bold text-[var(--sane-text)]">{titre}</span>
                  <span className="sane-small">{texte}</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
