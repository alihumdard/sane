"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "./api";

/**
 * Les deux champs invisibles que portent les formulaires publics.
 *
 * Ils n'existent que pour le serveur, qui s'en sert pour distinguer une
 * personne d'un script (voir `PiegeARobots` côté backend) :
 *
 * - **`site_web`** est un appât. Un humain ne le voit pas, donc ne le remplit
 *   pas ; un robot qui remplit tout ce qu'il trouve le remplit.
 * - **`_ouvert_le`** est l'instant où le formulaire a été ouvert, chiffré par
 *   le serveur. Un formulaire soumis en moins de trois secondes n'a pas été
 *   lu.
 *
 * Le jeton vient du serveur et non de `Date.now()` : une horloge de navigateur
 * se règle, et un horodatage que le client fabrique lui-même ne prouve rien.
 */
export function usePiege() {
  const [jeton, setJeton] = useState<string | null>(null);
  const [appat, setAppat] = useState("");

  // Un seul appel, même si le composant est remonté par un rendu concurrent.
  const demande = useRef(false);

  useEffect(() => {
    if (demande.current) return;

    demande.current = true;

    let annule = false;

    api
      .get<{ jeton: string }>("/formulaire/jeton")
      .then((res) => {
        if (!annule) setJeton(res.jeton);
      })
      .catch(() => {
        /*
         * Sans jeton, le formulaire part quand même.
         *
         * Le backend traite son absence comme « non renseigné » et laisse
         * passer : une panne de ce petit appel ne doit pas empêcher quelqu'un
         * de s'inscrire. Les autres défenses — appât, throttle, domaines
         * jetables, vérification de l'email — tiennent toujours.
         */
      });

    return () => {
      annule = true;
    };
  }, []);

  /** À étaler dans le corps de la requête. */
  const champs = () => ({
    site_web: appat,
    ...(jeton ? { _ouvert_le: jeton } : {}),
  });

  /**
   * Le champ appât lui-même.
   *
   * Il est retiré du flux visuel et de l'ordre de tabulation, et `aria-hidden`
   * le cache aux lecteurs d'écran : une personne qui navigue au clavier ou à
   * la voix ne doit jamais tomber dessus. Pas `display: none` ni `hidden`, que
   * certains robots repèrent précisément pour éviter le piège.
   */
  const ChampPiege = () => (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="site_web">Site web (laissez vide)</label>
      <input
        id="site_web"
        name="site_web"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={appat}
        onChange={(e) => setAppat(e.target.value)}
      />
    </div>
  );

  return { champs, ChampPiege };
}
