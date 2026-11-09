"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

/**
 * Un nombre qui monte jusqu'à sa valeur, une fois à l'écran.
 *
 * Il partait de zéro et n'en bougeait que si l'IntersectionObserver se
 * déclenchait. Quand le compteur était déjà visible au chargement — c'est le
 * cas de la barre posée juste sous le héros, sur toutes les pages publiques —
 * l'observateur pouvait n'émettre qu'avant le montage, et la barre restait
 * sur « 0 » indéfiniment : la page affichait 0 partenaire et 0 formation à
 * côté d'un encart serveur qui en annonçait 5 et 6.
 *
 * Deux garde-fous : on part de la valeur finale et l'animation n'est qu'un
 * agrément — si rien ne se déclenche, le bon chiffre est déjà là — et 1,2 s
 * plutôt que 4,5 s, parce qu'un chiffre qui met presque cinq secondes à
 * arriver se lit comme une erreur, pas comme une animation.
 */
export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const match = value.match(/^([+~>]*)(\d+)$/);
  const prefix = match?.[1] ?? "";
  const num = match ? parseInt(match[2], 10) : NaN;

  const [count, setCount] = useState(num);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;

    if (!el || isNaN(num)) return;

    // Le mouvement est un ornement : qui le refuse voit le chiffre, net.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(num);

      return;
    }

    let image = 0;

    const animer = () => {
      if (started.current) return;

      started.current = true;
      setCount(0);

      const duree = 1200;
      const depart = performance.now();

      const pas = (maintenant: number) => {
        const avancement = Math.min((maintenant - depart) / duree, 1);
        const adouci = 1 - Math.pow(1 - avancement, 3);

        setCount(Math.round(adouci * num));

        if (avancement < 1) image = requestAnimationFrame(pas);
      };

      image = requestAnimationFrame(pas);
    };

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) animer();
      },
      { threshold: 0.3 },
    );

    observateur.observe(el);

    return () => {
      observateur.disconnect();
      cancelAnimationFrame(image);
    };
  }, [num]);

  // La valeur change quand les chiffres arrivent du serveur, après le premier
  // rendu : sans cela le compteur garderait le NaN ou le zéro du départ.
  useEffect(() => {
    if (!isNaN(num) && !started.current) setCount(num);
  }, [num]);

  if (isNaN(num)) return <span className={className}>{value}</span>;

  // translate="no" pour la même raison que le compte à rebours : un nombre qui
  // change à chaque image n'a rien à traduire, et Google Translate s'empare du
  // nœud, après quoi React n'y écrit plus.
  return (
    <span ref={ref} translate="no" className={`notranslate ${className ?? ""}`}>
      {prefix}
      {count}
    </span>
  );
}
