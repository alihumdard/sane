/** Shared class strings so every form, button and link looks the same across the site. */

export const labelClass =
  "mb-2 block text-[length:var(--fs-small)] font-semibold text-[var(--sane-text)]";

export const inputWrap =
  "flex items-center overflow-hidden rounded-lg border border-[var(--sane-border)] bg-white transition-colors focus-within:border-[var(--sane-green)] focus-within:ring-2 focus-within:ring-[var(--sane-green)]/10";

export const inputClass =
  "min-w-0 flex-1 bg-transparent py-3 pr-3 text-[length:var(--fs-body)] text-[var(--sane-text)] outline-none placeholder:text-[var(--sane-text-light)]/60";

export const fieldClass =
  "w-full rounded-lg border border-[var(--sane-border)] bg-white px-4 py-3 text-[length:var(--fs-body)] text-[var(--sane-text)] outline-none transition-colors placeholder:text-[var(--sane-text-light)]/60 focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10";

export const selectClass = `${fieldClass} cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2361756B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat`;

export const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--sane-orange)] px-6 py-3.5 text-[length:var(--fs-small)] font-semibold !text-white transition-colors hover:bg-[var(--sane-orange-dark)]";

export const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--sane-border)] bg-white px-6 py-3.5 text-[length:var(--fs-small)] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]";

export const textLink =
  "inline-flex items-center gap-1.5 text-[length:var(--fs-small)] font-semibold text-[var(--sane-green)] transition-colors hover:text-[var(--sane-orange)]";
