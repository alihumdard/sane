/**
 * The four categorical accents the dashboards use, and nothing else.
 *
 * Every module carries one — its icon in the page header, the bar beside a
 * section heading, the wash behind a stat tile — so a glance at a screen says
 * which part of the back office it belongs to. Written once here because
 * three components were each keeping their own copy of the same four pairs.
 */
export type Accent = "green" | "orange" | "blue" | "teal";

export const ACCENTS: Record<Accent, { fond: string; trait: string; lueur: string }> = {
  green: { fond: "var(--sane-green-tint)", trait: "var(--sane-green)", lueur: "rgba(16,99,45,0.45)" },
  orange: { fond: "var(--sane-orange-tint)", trait: "var(--sane-orange)", lueur: "rgba(229,118,23,0.45)" },
  blue: { fond: "var(--sane-blue-tint)", trait: "var(--sane-blue)", lueur: "rgba(37,99,235,0.4)" },
  teal: { fond: "#e6f6f4", trait: "#0d9488", lueur: "rgba(13,148,136,0.4)" },
};

/**
 * When each accent's shine starts.
 *
 * Four tiles sit side by side; without this they flash in step, which reads
 * as something going wrong rather than as a finish.
 */
export const DEPART: Record<Accent, string> = {
  green: "0ms",
  orange: "1100ms",
  blue: "2200ms",
  teal: "3300ms",
};
