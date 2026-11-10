"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Google Analytics 4, chargé après l'hydratation pour ne pas retarder la page.
 *
 * Les pages vues sont envoyées à la main, jamais par gtag lui-même : les liens
 * des emails portent des jetons dans l'adresse (confirmation d'email,
 * d'inscription, mot de passe oublié), et l'envoi automatique transmettrait à
 * Google l'URL complète, jetons compris. Seuls la page et les paramètres de
 * campagne (source du code QR, utm_*) quittent le site.
 */
export const GA_ID = "G-06TL5JV2WE";

const PARAMETRES_GARDES = /^(source|utm_[a-z_]+)$/;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function adresseSansJeton(): string {
  const { origin, pathname, search } = window.location;
  const gardes = new URLSearchParams();

  new URLSearchParams(search).forEach((valeur, cle) => {
    if (PARAMETRES_GARDES.test(cle)) gardes.append(cle, valeur);
  });

  const requete = gardes.toString();
  return origin + pathname + (requete ? `?${requete}` : "");
}

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // La file d'attente précède la bibliothèque : ce qui y est poussé avant
    // son chargement est rejoué ensuite, la première page vue comprise.
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // gtag lit l'objet arguments lui-même, pas un tableau.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: false });
    }

    window.gtag("event", "page_view", {
      page_location: adresseSansJeton(),
      page_title: document.title,
    });
  }, [pathname]);

  return (
    <Script id="ga4" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
  );
}
