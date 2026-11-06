"use client";

import { useEffect, useState } from "react";
import { useStatistiques } from "@/lib/statistiques";

/**
 * Ce qui compte jusqu'à l'ouverture si l'édition n'a pas répondu.
 *
 * Le salon a déjà changé de date une fois : le compte à rebours lit donc
 * l'édition active, et cette valeur ne sert que tant que la réponse n'est pas
 * là, ou si elle ne vient jamais.
 */
const REPLI = "2026-12-03";

/** Le début du salon, à 9 h heure locale, depuis un « 2026-12-03T00:00:00Z ». */
function ouverture(dateDebut: string | null | undefined): number {
  // Le jour seul : lu tel quel, minuit UTC glisserait d'une heure sur Niamey.
  return new Date(`${(dateDebut ?? REPLI).slice(0, 10)}T09:00:00`).getTime();
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(debut: number): TimeLeft {
  const diff = debut - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const labels = ["JOURS", "HEURES", "MINUTES", "SECONDES"] as const;

export function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null);
  const debut = ouverture(useStatistiques()?.edition?.date_debut);

  useEffect(() => {
    // The first reading is deferred by a microtask rather than taken in the
    // effect body: still the same frame, without cascading a render.
    queueMicrotask(() => setTime(getTimeLeft(debut)));

    const id = setInterval(() => setTime(getTimeLeft(debut)), 1000);

    return () => clearInterval(id);
  }, [debut]);

  const values = time
    ? [time.days, time.hours, time.minutes, time.seconds]
    : [null, null, null, null];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
      {values.map((v, i) => (
        <div
          key={labels[i]}
          className="flex flex-col items-center justify-center rounded-lg bg-white/10 px-2 py-2.5 sm:px-3 sm:py-3"
          suppressHydrationWarning
        >
          <span
            className="text-xl font-extrabold leading-none text-white sm:text-2xl md:text-[28px]"
            suppressHydrationWarning
          >
            {v !== null ? String(v).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 text-[7px] font-bold uppercase tracking-wider text-white/60 sm:text-[8px]">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}
