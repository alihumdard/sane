/**
 * Where to focus each artwork when it is cropped by object-cover,
 * so faces and people stay visible. Add new images here.
 */
const FOCUS: Record<string, string> = {
  "/hero-bg.webp": "80% center",
  "/inscription-hero.webp": "center",
  "/sane-deal3.webp": "center 25%",
  "/emploi-bg.webp": "75% center",
  "/formation-bg.webp": "65% 40%",
  "/actualites2.webp": "70% center",
  "/SalonNationalbg.webp": "70% center",
  "/why-bg2.webp": "25% 30%",
  // Nom nouveau, et non l'ancien fichier écrasé : les images optimisées sont
  // mises en cache un an (minimumCacheTTL), et un visiteur revenu sur le site
  // gardait l'ancienne photo sous l'ancien nom. Une image remplacée change de
  // nom — c'est la seule façon de la faire arriver chez tout le monde.
  "/lieu-academie-arts-martiaux.webp": "center 40%",
  "/sanem_collage.webp": "40% center",
  "/Leadership2.webp": "center 35%",
  "/Transformation.webp": "center 35%",
  "/Transformation3.webp": "center 40%",
  "/Entrepreneuriat.webp": "center 40%",
};

export function imageFocus(src: string, fallback = "center") {
  return FOCUS[src] ?? fallback;
}
