"use client";

import { contactInfo } from "./data";
import { ReseauxSociaux } from "@/components/layout/ReseauxSociaux";
import { useParametres } from "@/lib/parametres";


export function ContactInfo() {
  const parametres = useParametres();

  /*
   * The organisation's own details win over the ones written here: a phone
   * number or an address lives in the settings, where the organisers can
   * correct it without a release. A line with nothing behind it keeps the
   * text below, which still says what the entry is for.
   */
  const coordonnees = contactInfo.map((c) => ({
    ...c,
    value:
      (c.title === "Téléphone" ? parametres.telephone : null)
      ?? (c.title === "Email" ? parametres.email : null)
      ?? (c.title === "Adresse" ? parametres.adresse : null)
      ?? c.value,
  })).filter((c) => c.value !== "");

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[2px] w-4 bg-[var(--sane-orange)]" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--sane-green)]">Nos coordonnées</span>
        </div>
        <p className="mb-6 text-[15px] text-[var(--sane-text-light)]">Plusieurs moyens pour nous joindre.</p>

        <ul className="flex flex-col gap-5">
          {coordonnees.map(({ icon: Icon, title, value, hint }, i) => (
            <li key={title} className="flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${i % 2 === 0 ? "bg-[var(--sane-orange)]" : "bg-[var(--sane-green)]"}`}>
                <Icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[var(--sane-text-light)]">{title}</p>
                <p className="text-[14px] font-bold text-[var(--sane-green-deep)]">{value}</p>
                <p className="text-[11px] text-[var(--sane-text-light)]">{hint}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="mb-2.5 text-[13px] font-semibold text-[var(--sane-green-deep)]">Suivez-nous</p>
          <ReseauxSociaux className="h-9 w-9 items-center justify-center rounded-full bg-[var(--sane-green)] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--sane-orange)]" />
        </div>
      </div>
    </div>
  );
}
