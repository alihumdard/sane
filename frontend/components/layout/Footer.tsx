import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ReseauxSociaux } from "./ReseauxSociaux";
import { CoordonneesPied } from "./CoordonneesPied";

export function Footer() {
  return (
    <footer className="bg-[var(--sane-c-0b6630)]">
      {/* ================= MAIN FOOTER ================= */}
      <div className="sane-container">
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 py-7 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 sm:py-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr] lg:gap-10 lg:py-16">
          {/* ================= 1. BRAND ================= */}
          <div className="col-span-2 flex flex-col lg:col-span-1">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-[135px]">
                <Image
                  src="/new-logo.png"
                  alt="SANEM Logo"
                  fill
                  className="object-contain object-left brightness-0 invert"
                  sizes="140px"
                />
              </div>
            </Link>

            <p className="mt-3 max-w-[280px] text-[12px] leading-[1.6] text-[var(--sane-green-muted)] sm:mt-4 sm:text-[13px]">
              Le Salon National de l&apos;Emploi, un espace de rencontre entre
              les talents, les entreprises et les opportunités professionnelles
              au Niger.
            </p>

            <ReseauxSociaux className="mt-4 h-9 w-9 items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:border-white hover:bg-white/10 sm:mt-5" />
          </div>

          {/* ================= 2. LIENS RAPIDES ================= */}
          <div>
            <h3 className="sane-h3 on-dark mb-3 sm:mb-5">Liens rapides</h3>

            <div className="flex flex-col gap-0.5 text-[13px] text-[var(--sane-green-muted)] lg:gap-1">
              <Link
                href="/"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Accueil
              </Link>

              <Link
                href="/a-propos"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                À propos
              </Link>

              <Link
                href="/programme"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Programme
              </Link>

              <Link
                href="/formations"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Formations
              </Link>

              <Link
                href="/emploi"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Emploi
              </Link>

              <Link
                href="/inscription"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Inscription
              </Link>

              <Link
                href="/connexion"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Connexion
              </Link>
            </div>
          </div>

          {/* ================= 3. DÉCOUVRIR ================= */}
          <div>
            <h3 className="sane-h3 on-dark mb-3 sm:mb-5">Découvrir</h3>

            <div className="flex flex-col gap-0.5 text-[13px] text-[var(--sane-green-muted)] lg:gap-1">
              <Link
                href="/intervenants"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Intervenants
              </Link>

              <Link
                href="/partenaires"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Partenaires
              </Link>

              <Link
                href="/actualites"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Actualités
              </Link>

              <Link
                href="/contact"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Contact
              </Link>

              <Link
                href="/faq"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                FAQ
              </Link>

              <Link
                href="/presse"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Presse
              </Link>
            </div>
          </div>

          {/* ================= 4. EMPLOI ================= */}
          <div>
            <h3 className="sane-h3 on-dark mb-3 sm:mb-5">Emploi</h3>

            <div className="flex flex-col gap-0.5 text-[13px] text-[var(--sane-green-muted)] lg:gap-1">
              <Link
                href="/emploi"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Offres d&apos;emploi
              </Link>

              <Link
                href="/creer-compte"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Demandeur d&apos;emploi
              </Link>

              <Link
                href="/creer-compte?role=recruteur"
                className="py-1 transition-colors hover:text-white sm:py-1.5"
              >
                Recruteur
              </Link>

            </div>
          </div>

          {/* ================= 5. CONTACT ================= */}
          <div>
            <h3 className="sane-h3 on-dark mb-3 sm:mb-5">Contact</h3>

            <div className="flex flex-col gap-2.5 text-[13px] text-[var(--sane-green-muted)] sm:gap-3 lg:gap-3.5">
              <CoordonneesPied />

              <Link
                href="/contact"
                className="inline-flex w-fit items-center gap-1.5 font-semibold text-white transition-colors hover:text-[var(--sane-green-muted)]"
              >
                Nous écrire
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="mt-6 hidden -rotate-3 lg:block">
              <p className="font-[family-name:var(--font-caveat)] text-[18px] italic leading-[1.25] text-white/80 xl:text-[20px]">
                L&apos;emploi
                <br />
                au cœur d&apos;un
                <br />
                Niger prospère
              </p>
              <div className="mt-1 h-[2px] w-12 rounded-full bg-[var(--sane-orange)]" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM LEGAL BAR ================= */}
      <div className="border-t border-white/15">
        <div className="sane-container">
          <div className="flex flex-col gap-3 py-5 text-[11px] text-[var(--sane-green-muted)] sm:text-xs md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 SANEM — Salon National de l&apos;Emploi. Tous droits
              réservés.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              <Link
                href="/mentions-legales"
                className="transition-colors hover:text-white"
              >
                Mentions légales
              </Link>

              <Link
                href="/confidentialite"
                className="transition-colors hover:text-white"
              >
                Politique de confidentialité
              </Link>

              <Link
                href="/conditions"
                className="transition-colors hover:text-white"
              >
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
