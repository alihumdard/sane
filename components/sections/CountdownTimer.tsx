"use client";

import { useEffect, useState } from "react";

// Change this date when the event date is confirmed
const EVENT_DATE_STR = "2026-03-15T09:00:00";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const target = new Date(EVENT_DATE_STR).getTime();
  const diff = target - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTime(getTimeLeft());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { value: time ? String(time.days).padStart(2, "0") : "--", label: "JOURS" },
    { value: time ? String(time.hours).padStart(2, "0") : "--", label: "HEURES" },
    { value: time ? String(time.minutes).padStart(2, "0") : "--", label: "MINUTES" },
    { value: time ? String(time.seconds).padStart(2, "0") : "--", label: "SECONDES" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center rounded-lg bg-white/10 px-2 py-2.5 sm:px-3 sm:py-3"
        >
          <span className="text-xl font-extrabold leading-none text-white sm:text-2xl md:text-[28px]">
            {item.value}
          </span>
          <span className="mt-1 text-[7px] font-bold uppercase tracking-wider text-white/60 sm:text-[8px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
