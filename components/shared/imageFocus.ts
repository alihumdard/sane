/**
 * Where to focus each artwork when it is cropped by object-cover,
 * so faces and people stay visible. Add new images here.
 */
const FOCUS: Record<string, string> = {
  "/sane_deal.png": "center 12%", // square photo, faces in the upper part
  "/hero-bg.png": "88% center", // wide banner, people on the right
  "/Leadership.png": "center 40%",
  "/Transformation.png": "center 40%",
  "/Entrepreneuriat.png": "center 40%",
};

export function imageFocus(src: string, fallback = "center") {
  return FOCUS[src] ?? fallback;
}
