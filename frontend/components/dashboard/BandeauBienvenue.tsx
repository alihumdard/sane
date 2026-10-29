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
    <div
      className="relative mb-6 overflow-hidden rounded-2xl px-5 py-6 text-white shadow-[0_18px_40px_-20px_rgba(10,46,22,0.75)] sm:px-7"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--sane-green-deep) 0%, var(--sane-green-dark) 55%, var(--sane-green) 130%)",
      }}
    >
      {/* A thin light along the top edge, as on a lit surface. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
      />
      {/* Two soft discs, drifting without end behind the greeting. */}
      <span
        aria-hidden
        className="sane-derive-a pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--sane-green)]/40 blur-2xl"
      />
      <span
        aria-hidden
        className="sane-derive-b pointer-events-none absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-[var(--sane-orange)]/20 blur-2xl"
      />
      <span
        aria-hidden
        className="sane-derive-b pointer-events-none absolute -left-20 bottom-[-70px] h-44 w-44 rounded-full bg-[var(--sane-green)]/25 blur-2xl"
        style={{ animationDuration: "34s", animationDirection: "reverse" }}
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
