"use client";

import { useEffect, useState } from "react";

const CLE = "sanem.menu.replie";

/**
 * Whether the menu is collapsed to its icons.
 *
 * Kept in localStorage because every navigation renders the shell afresh:
 * held in component state alone, the menu would spring back open on the next
 * page and the control would be useless.
 *
 * Read after mounting rather than during the first render — the server has no
 * localStorage, and a value read during rendering would not match what it
 * sent.
 */
export function useBarreLaterale() {
  const [replie, setReplie] = useState(false);

  useEffect(() => {
    try {
      const vu = window.localStorage.getItem(CLE) === "1";

      queueMicrotask(() => setReplie(vu));
    } catch {
      // Private browsing, blocked storage: the menu simply stays open.
    }
  }, []);

  function basculer() {
    setReplie((etat) => {
      const suivant = !etat;

      try {
        window.localStorage.setItem(CLE, suivant ? "1" : "0");
      } catch {
        // Same as above — the choice just will not outlive the page.
      }

      return suivant;
    });
  }

  return { replie, basculer };
}
