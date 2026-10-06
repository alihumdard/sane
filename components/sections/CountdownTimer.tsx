"use client";

import { useEffect, useState } from "react";

// Change this date when the event date is confirmed
const EVENT_DATE = new Date("2026-03-15T09:00:00");

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
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
