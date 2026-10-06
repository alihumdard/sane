import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface FeatureBarItem {
  icon?: LucideIcon;
  /** bold line (number, title…) */
  value: string;
  /** small line under it */
  label: string;
  /** tile color for the "solid" variant */
  color?: string;
}

interface Props {
  items: FeatureBarItem[];
  /**
   * soft  – tinted icon tile (stats, contact info)
   * solid – brand-colored icon tile (perks)
   * plain – big centered numbers, no icons
   */
  variant?: "soft" | "solid" | "plain";
}

/** One strip of 4 facts that sits right under a page hero. */
export function FeatureBar({ items, variant = "soft" }: Props) {
  return (
    <section className="border-b border-[var(--sane-border)] bg-white">
      <Container>
        <div className="grid grid-cols-2 divide-x divide-[var(--sane-border)] max-lg:[&>*:nth-child(n+3)]:border-t max-lg:[&>*:nth-child(n+3)]:border-[var(--sane-border)] lg:grid-cols-4">
          {items.map(({ icon: Icon, value, label, color }) =>
            variant === "plain" ? (
              <div key={label} className="flex flex-col items-center justify-center gap-1 px-4 py-8 text-center">
                <span className="text-[length:var(--fs-h1)] font-extrabold leading-none text-[var(--sane-green)]">{value}</span>
                <span className="sane-small">{label}</span>
              </div>
            ) : (
              <div key={label} className="flex flex-col items-start gap-2.5 px-3.5 py-5 sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-6">
                {Icon && (
                  <span
                    className={`flex shrink-0 items-center justify-center ${
                      variant === "solid"
                        ? "h-11 w-11 rounded-xl text-white sm:h-12 sm:w-12"
                        : "h-11 w-11 rounded-xl bg-[var(--sane-orange-light)] text-[var(--sane-orange)]"
                    }`}
                    style={variant === "solid" ? { backgroundColor: color } : undefined}
                  >
                    <Icon size={variant === "solid" ? 24 : 22} />
                  </span>
                )}
                <div className="min-w-0 [overflow-wrap:anywhere]">
                  <span className="block text-[length:var(--fs-body)] font-extrabold leading-snug text-[var(--sane-text)] sm:text-[length:var(--fs-lead)]">{value}</span>
                  <span className="sane-small">{label}</span>
                </div>
              </div>
            )
          )}
        </div>
      </Container>
    </section>
  );
}
