"use client";

import { MapPin, Mail, Phone } from "lucide-react";
import { useParametres } from "@/lib/parametres";

const ligne = "flex items-center gap-2.5 break-words";
const icone = "shrink-0 text-[var(--sane-orange)]";

/**
 * Address, email and phone, from the organisation's settings.
 *
 * The phone sat in the source as `+227 XX XX XX XX`, here and in two other
 * files. A line with nothing behind it is not shown at all: a placeholder
 * number on a public site is worse than no number.
 */
export function CoordonneesPied() {
  const { adresse, email, telephone } = useParametres();

  return (
    <>
      <div className={`${ligne} ${adresse ? "flex" : "hidden"}`}>
        <MapPin size={15} className={icone} />
        <span>{adresse}</span>
      </div>

      <div className={`${ligne} ${email ? "flex" : "hidden"}`}>
        <Mail size={15} className={icone} />
        <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
      </div>

      <div className={`${ligne} ${telephone ? "flex" : "hidden"}`}>
        <Phone size={15} className={icone} />
        <a href={`tel:${(telephone ?? "").replace(/\s/g, "")}`} className="hover:text-white">{telephone}</a>
      </div>
    </>
  );
}
