import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { textLink } from "@/components/ui/styles";
import { couleurPartenaire, initiales } from "@/components/partenaires/data";

export interface PartenairePublic {
  id: number;
  nom: string;
  logo: string | null;
  site_web: string | null;
}

/**
 * The partners who recruit at the salon, read from the back-office.
 *
 * Five were written into this file — the Republic of Niger, the ILO, Enabel,
 * GIZ, the AFD — under the heading "Ils nous font confiance", regardless of
 * who the organisers had actually signed. The Partenaires page had the same
 * problem and was fixed; this grid kept its own copy.
 *
 * A partner with no logo shows its initials on a tinted disc, so the grid has
 * no holes in it while the logos are being collected.
 */
export function PartnersSection({ partenaires = [] }: { partenaires?: PartenairePublic[] }) {
  return (
    <section
      className={
        "bg-[var(--sane-background)] pb-10 pt-2 sm:pb-12 md:pb-16 " +
        (partenaires.length > 0 ? "block" : "hidden")
      }
    >
      <Container>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--sane-green)]">
                Nos partenaires qui recrutent
              </span>
            </div>
            <h2 className="sane-h2">Ils nous font confiance</h2>
          </div>

          <Link href="/partenaires" className={textLink + " whitespace-nowrap"}>
            Tous les partenaires <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {partenaires.map((p) => {
            const contenu = (
              <>
                <div className={"relative h-12 w-full sm:h-14 " + (p.logo ? "block" : "hidden")}>
                  <Image
                    src={p.logo ?? "/new-logo.png"}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-contain"
                  />
                </div>

                <span
                  aria-hidden
                  className={
                    "h-12 w-12 items-center justify-center rounded-full text-[13px] font-extrabold text-white sm:h-14 sm:w-14 " +
                    (p.logo ? "hidden" : "flex")
                  }
                  style={{ backgroundColor: couleurPartenaire(p.nom) }}
                >
                  {initiales(p.nom)}
                </span>

                <span className="text-center text-[10px] font-semibold leading-tight text-[var(--sane-text-light)] sm:text-[11px]">
                  {p.nom}
                </span>
              </>
            );

            const classe =
              "group flex flex-col items-center justify-center gap-2.5 rounded-xl border border-[var(--sane-border)] bg-white px-3 py-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:px-4 sm:py-5";

            return p.site_web ? (
              <Link
                key={p.id}
                href={p.site_web}
                target="_blank"
                rel="noreferrer noopener"
                title={"Ouvrir le site de " + p.nom}
                className={classe}
              >
                {contenu}
              </Link>
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
