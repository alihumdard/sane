/**
 * Where to focus each artwork when it is cropped by object-cover,
 * so faces and people stay visible. Add new images here.
 */
const FOCUS: Record<string, string> = {
  "/hero-bg.webp": "80% center",
  "/sane_deal.webp": "center 30%",
  "/sane-deal3.webp": "center 25%",
  "/emploi-bg.webp": "75% center",
  "/formation-bg.webp": "65% 40%",
  "/actualites2.webp": "70% center",
  "/SalonNationalbg.webp": "70% center",
  "/why-bg2.webp": "25% 30%",
  "/programme-bd.webp": "center 40%",
  "/contact-bulding.webp": "center 40%",
  "/sanem_collage.webp": "40% center",
  "/Leadership2.webp": "center 35%",
  "/Transformation.webp": "center 35%",
  "/Transformation3.webp": "center 40%",
  "/Entrepreneuriat.webp": "center 40%",
};

export function imageFocus(src: string, fallback = "center") {
  return FOCUS[src] ?? fallback;
}
