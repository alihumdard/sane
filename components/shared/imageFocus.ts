/**
 * Where to focus each artwork when it is cropped by object-cover,
 * so faces and people stay visible. Add new images here.
 */
const FOCUS: Record<string, string> = {
  "/hero-bg.png": "80% center",
  "/sane_deal.png": "center 30%",
  "/sane-deal3.png": "center 25%",
  "/emploi-bg.png": "75% center",
  "/formation-bg.png": "65% 40%",
  "/actualites2.png": "70% center",
  "/SalonNationalbg.png": "70% center",
  "/why-bg2.png": "25% 30%",
  "/programme-bd.png": "center 40%",
  "/contact-bulding.png": "center 40%",
  "/sanem_collage.png": "40% center",
  "/Leadership.png": "center 35%",
  "/Leadership2.png": "center 35%",
  "/Transformation.png": "center 35%",
  "/Transformation3.png": "center 40%",
  "/Entrepreneuriat.png": "center 40%",
};

export function imageFocus(src: string, fallback = "center") {
  return FOCUS[src] ?? fallback;
}
