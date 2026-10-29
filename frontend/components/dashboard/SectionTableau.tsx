import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ACCENTS, type Accent } from "./accents";

/**
 * A heading over a block of a dashboard.
 *
 * The screens each wrote their own: an h2 at one size here, a flex row with a
 * "Tout voir →" there, a bare paragraph on the back office. One shape now, so
 * the three dashboards read as one product.
 */
export function SectionTableau({
  titre,
  description,
  lien,
  action,
  accent = "green",
  children,
}: {
  titre: string;
  description?: string;
  /** "See everything" link, shown on the right of the heading. */
  lien?: { href: string; label: string };
  /** Anything else for the right-hand side; takes precedence over `lien`. */
  action?: ReactNode;
  /** Colour of the bar beside the heading; green when not given. */
  accent?: Accent;
  children: ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div className="flex min-w-0 gap-2.5">
          {/* A short bar in the block's colour, so a page of stacked sections
              is read as sections rather than as one column of text. */}
          <span
            aria-hidden
            className="mt-[3px] h-[18px] w-[3px] shrink-0 rounded-full"
            style={{ backgroundColor: ACCENTS[accent].trait }}
          />
          <div className="min-w-0">
          <h2 className="text-[15px] font-bold leading-tight text-[var(--sane-text)]">{titre}</h2>
          <p
            className={
              "mt-0.5 text-[12px] text-[var(--sane-text-light)] " + (description ? "block" : "hidden")
            }
          >
            {description}
          </p>
          </div>
        </div>

        {action}

        <Link
          href={lien?.href ?? "#"}
          className={
            "group shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-green-dark)] " +
            (lien && !action ? "inline-flex" : "hidden")
          }
        >
          {lien?.label}
          <ArrowRight size={14} className="sane-fleche" />
        </Link>
      </div>

      {children}
    </section>
  );
}
