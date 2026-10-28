"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { textLink } from "@/components/ui/styles";
import { api } from "@/lib/api";
import { couleurPartenaire, initiales } from "./data";

export interface ApiPartenaire {
  id: number;
  nom: string;
  slug: string;
  type: string;
  logo: string | null;
  site_web: string | null;
  description: string | null;
}

/**
 * The partners the organisers entered, and only those.
 *
 * Twenty were written into this file — the ministry, the ILO, the World Bank
 * and a dozen more — while the back-office held five real ones that the page
 * never showed. An organiser added a partner and found them nowhere.
 *
 * A partner with no logo shows its initials on a tinted disc, as before: the
 * grid should not have holes in it while the logos are being collected.
 */
export function PartnerLogosSection({ initiaux = [] }: { initiaux?: ApiPartenaire[] }) {
  const [partenaires, setPartenaires] = useState<ApiPartenaire[]>(initiaux);

  useEffect(() => {
    let annule = false;

    api
      .get<{ data: ApiPartenaire[] }>("/partenaires")
      .then((r) => {
        if (!annule) setPartenaires(r.data ?? []);
      })
      .catch(() => {
        // An empty grid rather than partners who never signed anything.
      });

    return () => {
      annule = true;
    };
  }, []);

  return (
    <section
      id="partenaires"
      className={`scroll-mt-20 bg-white py-10 sm:py-12 md:py-16 ${partenaires.length ? "block" : "hidden"}`}
    >
      <Container>
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeading
            eyebrow="Nos partenaires"
            title="Ils nous font confiance"
            description="Le SANEM remercie l'ensemble de ses partenaires pour leur engagement à soutenir l'emploi, la formation et le développement des compétences au Niger."
            className="max-w-[460px]"
          />
          <div className="flex flex-col gap-3 sm:items-end">
            <Link href="/contact" className={textLink}>
              Devenir partenaire <ArrowRight size={15} />
            </Link>
            <p className="sane-small max-w-[200px] italic sm:text-right">Des partenariats pour un Niger plus fort</p>
          </div>
        </div>

        <div className="grid grid-cols-2 border border-[var(--sane-border)] sm:grid-cols-4 lg:grid-cols-5 [&>*]:border-b [&>*]:border-r [&>*]:border-[var(--sane-border)]">
          {partenaires.map((p) => {
            const contenu = (
              <>
                {p.logo ? (
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16">
                    <Image src={p.logo} alt={p.nom} fill sizes="64px" className="object-contain" />
                  </div>
                ) : (
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full text-[length:var(--fs-small)] font-bold text-white shadow-sm sm:h-16 sm:w-16"
                    style={{ backgroundColor: couleurPartenaire(p.nom) }}
                  >
                    {initiales(p.nom)}
                  </span>
                )}
                <span className="text-center text-[length:var(--fs-small)] font-medium leading-tight text-[var(--sane-text)]">
                  {p.nom}
                </span>
              </>
            );

            const classe =
              "flex flex-col items-center justify-center gap-3 bg-white p-5 transition-colors hover:bg-[var(--sane-background)] sm:p-6";

            // Only a partner who gave an address becomes a link.
            return p.site_web ? (
              <a key={p.id} href={p.site_web} target="_blank" rel="noreferrer noopener" className={classe}>
                {contenu}
              </a>
            ) : (
              <div key={p.id} className={classe}>
                {contenu}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
