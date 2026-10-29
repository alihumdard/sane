"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** What a form reports back to the list it returns to. */
export type Enregistrement = "cree" | "modifie";

const TEXTES: Record<Enregistrement, string> = {
  cree: "Créé. Le nouvel élément apparaît dans la liste ci-dessous.",
  modifie: "Modifications enregistrées.",
};

/** Where a form sends the admin once it has saved. */
export function retourApresEnregistrement(base: string, etat: Enregistrement): string {
  return base + "?enregistre=" + etat;
}

/**
 * The confirmation a list shows after a form sent the admin back to it.
 *
 * Saving used to leave the admin on the form, looking at the fields they had
 * just filled in, with no sign of the record among the others — so the next
 * thing to do was find the way back to the list by hand.
 *
 * The flag is taken out of the address as soon as it is read, so reloading
 * the list does not announce a save that happened some time ago.
 */
export function useMessageEnregistrement(base: string): string | null {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  const etat = params.get("enregistre");

  useEffect(() => {
    if (etat !== "cree" && etat !== "modifie") return;

    // Deferred so the update lands outside the effect's synchronous body.
    queueMicrotask(() => setMessage(TEXTES[etat]));
    router.replace(base, { scroll: false });
  }, [etat, base, router]);

  return message;
}
