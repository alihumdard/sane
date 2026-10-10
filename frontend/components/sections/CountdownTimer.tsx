"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-12-10T09:00:00").getTime();

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const diff = EVENT_DATE - Date.now();
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

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

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
