import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-[#dce8e1] bg-white">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <div className="flex h-14 w-24 items-center justify-center rounded-full border-[3px] border-[#E57617]">
                <span className="text-2xl font-black tracking-tight text-[#10632D]">
                  SANE
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#61756B]">
              Le Salon National de l&apos;Emploi, un espace de rencontre
              entre les talents, les entreprises et les opportunités
              professionnelles.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10632D] text-xs font-bold text-white transition-colors hover:bg-[#E57617]"
              >
                f
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10632D] text-xs font-bold text-white transition-colors hover:bg-[#E57617]"
              >
                in
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10632D] text-xs font-bold text-white transition-colors hover:bg-[#E57617]"
              >
                ig
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-[#10231A]">
              Navigation
            </h3>

            <div className="flex flex-col gap-3 text-sm text-[#61756B]">
              <Link
                href="/"
                className="transition-colors hover:text-[#10632D]"
              >
                Accueil
              </Link>

              <Link
                href="/a-propos"
                className="transition-colors hover:text-[#10632D]"
              >
                À propos
              </Link>

              <Link
                href="/programme"
                className="transition-colors hover:text-[#10632D]"
              >
                Programme
              </Link>

              <Link
                href="/formations"
                className="transition-colors hover:text-[#10632D]"
              >
                Formations
              </Link>

              <Link
                href="/intervenants"
                className="transition-colors hover:text-[#10632D]"
              >
                Intervenants
              </Link>

              <Link
                href="/partenaires"
                className="transition-colors hover:text-[#10632D]"
              >
                Partenaires
              </Link>

              <Link
                href="/actualites"
                className="transition-colors hover:text-[#10632D]"
              >
                Actualités
              </Link>
            </div>
          </div>

          {/* Employment */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-[#10231A]">
              Emploi
            </h3>

            <div className="flex flex-col gap-3 text-sm text-[#61756B]">
              <Link
                href="/emploi"
                className="transition-colors hover:text-[#10632D]"
              >
                Offres d&apos;emploi
              </Link>

              <Link
                href="/demandeur-emploi"
                className="transition-colors hover:text-[#10632D]"
              >
                Demandeur d&apos;emploi
              </Link>

              <Link
                href="/recruteur"
                className="transition-colors hover:text-[#10632D]"
              >
                Recruteur
              </Link>

              <Link
                href="/matching"
                className="transition-colors hover:text-[#10632D]"
              >
                Matching
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-[#10231A]">
              Contact
            </h3>

            <div className="flex flex-col gap-4 text-sm text-[#61756B]">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#E57617]"
                />
                <span>Niamey, Niger</span>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-[#E57617]"
                />
                <span>contact@sane.ne</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-[#E57617]"
                />
                <span>+227 XX XX XX XX</span>
              </div>

              <Link
                href="/contact"
                className="mt-2 inline-flex w-fit items-center gap-2 font-semibold text-[#10632D] transition-colors hover:text-[#E57617]"
              >
                Nous écrire
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Footer */}
      <div className="border-t border-[#dce8e1]">
        <Container>
          <div className="flex flex-col gap-4 py-5 text-xs text-[#61756B] md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 SANE — Salon National de l&apos;Emploi. Tous droits
              réservés.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/mentions-legales"
                className="transition-colors hover:text-[#10632D]"
              >
                Mentions légales
              </Link>

              <Link
                href="/confidentialite"
                className="transition-colors hover:text-[#10632D]"
              >
                Politique de confidentialité
              </Link>

              <Link
                href="/conditions"
                className="transition-colors hover:text-[#10632D]"
              >
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}