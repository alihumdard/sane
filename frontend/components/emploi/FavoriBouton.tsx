"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ApiOffre } from "@/lib/types";

/**
 * Save an offer to come back to it later.
 *
 * Only shown to a signed-in jobseeker: for anyone else there is nowhere to
 * save it to. Like the application card, the current state is asked from the
 * browser — the page itself is rendered on the server and cached, so it never
 * carries anyone's token.
 */
export function FavoriBouton({ offre }: { offre: ApiOffre }) {
  const { user } = useAuth();

  const [favori, setFavori] = useState(offre.en_favori ?? false);
  const [envoi, setEnvoi] = useState(false);

  const peut = user?.role === "demandeur" || user?.role === "participant";

  useEffect(() => {
    if (!peut) return;

    let annule = false;

    api
      .get<{ data: ApiOffre }>(`/offres/${encodeURIComponent(offre.slug)}`)
      .then((res) => {
        if (!annule) setFavori(Boolean(res.data.en_favori));
      })
      .catch(() => {
        // Leave the button in its default state; toggling still works.
      });

    return () => {
      annule = true;
    };
  }, [peut, offre.slug]);

  if (!peut) return null;

  async function basculer() {
    // Flipped before the request so the heart answers immediately, and put
    // back if the server refuses.
    const avant = favori;

    setFavori(!avant);
    setEnvoi(true);

    try {
      await api.post(`/offres/${offre.id}/favori`);
    } catch {
      setFavori(avant);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <button
      type="button"
      onClick={basculer}
      disabled={envoi}
      aria-pressed={favori}
      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-[13px] font-bold transition-colors disabled:opacity-60 ${
        favori
          ? "border-[var(--sane-orange)] bg-[#fff8ed] text-[var(--sane-orange)]"
          : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-orange)]"
      }`}
    >
      <Heart size={15} className={favori ? "fill-[var(--sane-orange)]" : ""} />
      {favori ? "Retirer des favoris" : "Ajouter aux favoris"}
    </button>
  );
}
