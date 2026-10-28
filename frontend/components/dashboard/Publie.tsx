/**
 * The published / hidden chip the back-office lists all carried a copy of.
 *
 * Six lists spelled out the same twelve lines of classes with different
 * wording, which is why four of them drifted apart in padding and colour.
 */
export function Publie({ actif, oui, non }: { actif: boolean; oui: string; non: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold " +
        (actif
          ? "bg-[var(--sane-green-light)] text-[var(--sane-green)]"
          : "bg-[var(--sane-background)] text-[var(--sane-text-light)]")
      }
    >
      <span
        aria-hidden
        className={
          "h-1.5 w-1.5 rounded-full " + (actif ? "bg-[var(--sane-green)]" : "bg-[var(--sane-text-light)]/50")
        }
      />
      {actif ? oui : non}
    </span>
  );
}
