"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { ApiNotification, NotificationsResponse } from "@/lib/types";

/** "Il y a 5 min" / "Hier" / "12 oct." from an ISO timestamp. */
function tempsRelatif(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;

  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `Il y a ${heures} h`;

  const jours = Math.floor(heures / 24);
  if (jours === 1) return "Hier";
  if (jours < 7) return `Il y a ${jours} j`;

  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/**
 * Self-contained bell menu: polls /notifications on a minute's interval and
 * owns its own open/closed state, so any logged-in layout (admin navbar,
 * jobseeker/recruiter header) can drop it in without wiring anything.
 */
export function NotificationBell({ iconClassName = "text-[var(--sane-text-light)]" }: { iconClassName?: string }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [count, setCount] = useState(0);
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ouvert) return;

    function surClic(e: MouseEvent) {
      if (!zone.current?.contains(e.target as Node)) setOuvert(false);
    }

    document.addEventListener("mousedown", surClic);
    return () => document.removeEventListener("mousedown", surClic);
  }, [ouvert]);

  useEffect(() => {
    let annule = false;

    async function charger() {
      try {
        const res = await api.get<NotificationsResponse>("/notifications");
        if (annule) return;
        setNotifications(res.data);
        setCount(res.non_lues);
      } catch (e) {
        if (!(e instanceof ApiError)) throw e;
      }
    }

    void charger();
    const interval = setInterval(charger, 60_000);

    return () => {
      annule = true;
      clearInterval(interval);
    };
  }, []);

  async function toutMarquerLu() {
    setCount(0);
    setNotifications((liste) => liste.map((n) => ({ ...n, lue: true })));

    try {
      await api.post("/notifications/tout-lu");
    } catch {
      // The next poll reconciles state either way.
    }
  }

  async function ouvrirNotification(n: ApiNotification) {
    setOuvert(false);

    if (!n.lue) {
      setCount((c) => Math.max(0, c - 1));
      setNotifications((liste) => liste.map((x) => (x.id === n.id ? { ...x, lue: true } : x)));
      try {
        await api.post(`/notifications/${n.id}/lue`);
      } catch {
        // Same reconciliation as above.
      }
    }

    if (n.lien) router.push(n.lien);
  }

  return (
    <div ref={zone} className="relative shrink-0">
      <button type="button" aria-label="Notifications" onClick={() => setOuvert((o) => !o)} className="relative block">
        <Bell size={20} className={iconClassName} />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--sane-orange)] text-[8px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {ouvert && (
        <div className="absolute right-0 top-9 z-40 w-[290px] rounded-xl border border-[var(--sane-border)] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--sane-border)] px-3 py-2.5">
            <span className="text-[12px] font-bold text-[var(--sane-green-deep)]">Notifications</span>
            {count > 0 && (
              <button type="button" onClick={toutMarquerLu} className="text-[10px] font-semibold text-[var(--sane-orange)] hover:underline">
                Tout marquer comme lu
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-[11px] text-[var(--sane-text-light)]">Aucune notification.</p>
          ) : (
            <ul className="max-h-[260px] overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="border-b border-[var(--sane-border)]/60 last:border-0">
                  <button
                    type="button"
                    onClick={() => ouvrirNotification(n)}
                    className={`flex w-full gap-2 px-3 py-2.5 text-left hover:bg-[var(--sane-background)] ${n.lue ? "" : "bg-[var(--sane-background)]"}`}
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.lue ? "bg-transparent" : "bg-[var(--sane-orange)]"}`} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[var(--sane-green-deep)]">{n.titre}</p>
                      <p className="text-[10px] text-[var(--sane-text-light)]">{n.message}</p>
                      <p className="mt-0.5 text-[9px] text-[var(--sane-text-light)]">{tempsRelatif(n.created_at)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
