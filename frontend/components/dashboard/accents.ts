/**
 * The four categorical accents the dashboards use, and nothing else.
 *
 * Every module carries one — its icon in the page header, the bar beside a
 * section heading, the wash behind a stat tile — so a glance at a screen says
 * which part of the back office it belongs to. Written once here because
 * three components were each keeping their own copy of the same four pairs.
 */
export type Accent = "green" | "orange" | "blue" | "teal";

export const ACCENTS: Record<Accent, { fond: string; trait: string }> = {
  green: { fond: "var(--sane-green-tint)", trait: "var(--sane-green)" },
  orange: { fond: "var(--sane-orange-tint)", trait: "var(--sane-orange)" },
  blue: { fond: "var(--sane-blue-tint)", trait: "var(--sane-blue)" },
  teal: { fond: "#e6f6f4", trait: "#0d9488" },
};
