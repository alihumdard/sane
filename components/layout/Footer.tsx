import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0B6630]">
      {/* ================= MAIN FOOTER ================= */}
      <div className="sane-container">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr] lg:gap-10 lg:py-16">
          {/* ================= 1. BRAND ================= */}
          <div className="min-[480px]:col-span-2 flex flex-col sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-[135px]">
                <Image
                  src="/new-logo.png"
                  alt="SANEM Logo"
                  fill
                  priority
                  className="object-contain object-left brightness-0 invert"
                  sizes="140px"
                />
              </div>
            </Link>

            <p className="mt-4 max-w-[280px] text-[13px] leading-[1.6] text-[var(--sane-green-muted)]">
              Le Salon National de l&apos;Emploi, un espace de rencontre entre
              les talents, les entreprises et les opportunités professionnelles
              au Niger.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* X */}
              <a
                href="#"
                aria-label="X / Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.764 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.204-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ================= 2. LIENS RAPIDES ================= */}
          <div>
            <h3 className="sane-h3 on-dark mb-5">Liens rapides</h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[13px] text-[var(--sane-green-muted)] lg:flex lg:flex-col lg:gap-1">
              <Link
                href="/"
                className="py-1.5 transition-colors hover:text-white"
              >
                Accueil
              </Link>

              <Link
                href="/a-propos"
                className="py-1.5 transition-colors hover:text-white"
              >
                À propos
              </Link>

              <Link
                href="/programme"
                className="py-1.5 transition-colors hover:text-white"
              >
                Programme
              </Link>

              <Link
                href="/formations"
                className="py-1.5 transition-colors hover:text-white"
              >
                Formations
              </Link>

              <Link
                href="/emploi"
                className="py-1.5 transition-colors hover:text-white"
              >
                Emploi
              </Link>
            </div>
          </div>

          {/* ================= 3. DÉCOUVRIR ================= */}
          <div>
            <h3 className="sane-h3 on-dark mb-5">Découvrir</h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[13px] text-[var(--sane-green-muted)] lg:flex lg:flex-col lg:gap-1">
              <Link
                href="/intervenants"
                className="py-1.5 transition-colors hover:text-white"
              >
                Intervenants
              </Link>

              <Link
                href="/partenaires"
                className="py-1.5 transition-colors hover:text-white"
              >
                Partenaires
              </Link>

              <Link
                href="/actualites"
                className="py-1.5 transition-colors hover:text-white"
              >
                Actualités
              </Link>

              <Link
                href="/contact"
                className="py-1.5 transition-colors hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* ================= 4. EMPLOI ================= */}
          <div>
            <h3 className="sane-h3 on-dark mb-5">Emploi</h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[13px] text-[var(--sane-green-muted)] lg:flex lg:flex-col lg:gap-1">
              <Link
                href="/emploi"
                className="py-1.5 transition-colors hover:text-white"
              >
                Offres d&apos;emploi
              </Link>

              <Link
                href="/demandeur-emploi"
                className="py-1.5 transition-colors hover:text-white"
              >
                Demandeur d&apos;emploi
              </Link>

              <Link
                href="/recruteur"
                className="py-1.5 transition-colors hover:text-white"
              >
                Recruteur
              </Link>

              <Link
                href="/matching"
                className="py-1.5 transition-colors hover:text-white"
              >
                Matching
              </Link>
            </div>
          </div>

          {/* ================= 5. CONTACT ================= */}
          <div>
            <h3 className="sane-h3 on-dark mb-5">Contact</h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3.5 text-[13px] text-[var(--sane-green-muted)] lg:flex lg:flex-col lg:gap-3.5">
              <div className="flex items-center gap-2.5 break-words">
                <MapPin
                  size={15}
                  className="shrink-0 text-[var(--sane-orange)]"
                />
                <span>Niamey, Niger</span>
              </div>

              <div className="flex items-center gap-2.5 break-words">
                <Mail
                  size={15}
                  className="shrink-0 text-[var(--sane-orange)]"
                />
                <span>contact@sanem.ne</span>
              </div>

              <div className="flex items-center gap-2.5 break-words">
                <Phone
                  size={15}
                  className="shrink-0 text-[var(--sane-orange)]"
                />
                <span>+227 XX XX XX XX</span>
              </div>

              <Link
                href="/contact"
                className="inline-flex w-fit items-center gap-1.5 font-semibold text-white transition-colors hover:text-[var(--sane-green-muted)]"
              >
                Nous écrire
                <ArrowUpRight size={15} />
              </Link>
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
