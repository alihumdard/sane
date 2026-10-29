"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

/** "Amadou Issoufou" -> "Amadou", which is how a greeting reads. */
function prenom(nom: string | undefined): string {
  return (nom ?? "").trim().split(/\s+/)[0] ?? "";
}

/**
 * The strip that opens a dashboard.
 *
 * The jobseeker's dashboard had one and the other two did not, so the
 * back-office and the recruiter space began with a row of tiles and no sense
 * of whose screen it was. The same block now opens all three.
 */
export function BandeauBienvenue({
  sousTitre,
  children,
}: {
  sousTitre: string;
  /** Figures or links shown on the right, e.g. the current edition. */
  children?: ReactNode;
}) {
  const { user } = useAuth();
  const nom = prenom(user?.nom);

  return (
    <div className="sane-apparait relative mb-6 overflow-hidden rounded-2xl bg-[var(--sane-green-deep)] px-5 py-6 text-white sm:px-7">
      {/* Two soft discs, for a surface that is not a flat rectangle. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--sane-green)]/40 blur-2xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[var(--sane-orange)]/15 blur-2xl"
      />

      <div className="relative flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <h2 className="text-[21px] font-extrabold leading-tight tracking-[-0.015em] sm:text-[25px]">
            Bonjour{nom ? " " + nom : ""} 👋
          </h2>
          <p className="mt-1.5 max-w-[560px] text-[13px] leading-relaxed text-white/75">{sousTitre}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

/** One figure on the welcome strip, for the things worth reading first. */
export function ChiffreBandeau({ valeur, label }: { valeur: ReactNode; label: string }) {
  return (
    <div className="min-w-[88px] rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/15">
      <p className="text-[19px] font-extrabold leading-none">{valeur}</p>
      <p className="mt-1 text-[11px] leading-tight text-white/70">{label}</p>
    </div>
  );
}
