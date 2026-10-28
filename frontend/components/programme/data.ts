import { CalendarDays, MapPin, UsersRound, Mic } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { InfoItem } from "@/components/shared";

export interface ProgrammeDocument {
  title: string;
  format: string;
  href: string;
  icon: LucideIcon;
}

/*
 * The schedule itself lives in the database now, edited from the back-office:
 * eight sessions used to sit here, for one unnamed day, and every change of
 * hour was a release. Only the chip colours stay, keyed by the names the
 * schedule already used.
 */
export const tagStyles: Record<string, string> = {
  Accueil: "bg-[var(--sane-green-light)] text-[var(--sane-green)]",
  Cérémonie: "bg-[var(--sane-orange-tint)] text-[var(--sane-orange)]",
  Conférence: "bg-[var(--sane-c-e8f0ff)] text-[var(--sane-c-2b6cb0)]",
  Panel: "bg-[var(--sane-purple-tint)] text-[var(--sane-c-6b46c1)]",
  Networking: "bg-[var(--sane-c-e8fff3)] text-[var(--sane-c-0f766e)]",
  Formation: "bg-[var(--sane-c-fef3c7)] text-[var(--sane-c-92400e)]",
  Recrutement: "bg-[var(--sane-c-fee2e2)] text-[var(--sane-red-dark)]",
};

/** The fair's dates, as every public page states them. */
export const DATES_SALON = "10 – 12 décembre 2026";

export const eventInfo: InfoItem[] = [
  { icon: CalendarDays, title: "Date", description: DATES_SALON },
  { icon: MapPin, title: "Lieu", description: "Niamey, Niger" },
  { icon: UsersRound, title: "Participants", description: "+1000 attendus" },
  { icon: Mic, title: "Sessions", description: "Conférences, formations, réseautage, recrutement" },
];

/*
 * The official documents, once there are any.
 *
 * This held three entries — a programme, a participant guide, a site plan —
 * with file sizes to the tenth of a megabyte and no files behind them. A
 * download button that downloads nothing is worse than no button, so the
 * section hides itself while the list is empty.
 */
export const documents: ProgrammeDocument[] = [];
