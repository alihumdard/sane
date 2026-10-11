/** Match score, coloured by band so a list scans at a glance. */
export function ScoreBadge({ score }: { score: number }) {
  const couleur =
    score >= 75
      ? "var(--sane-green)"
      : score >= 50
        ? "var(--sane-orange)"
        : "var(--sane-text-light)";

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        className="relative h-11 w-11 rounded-full"
        style={{
          background: `conic-gradient(${couleur} ${score * 3.6}deg, var(--sane-border) 0deg)`,
        }}
        role="img"
        aria-label={`Score de correspondance : ${score} sur 100`}
      >
        <span className="absolute inset-[3px] flex items-center justify-center rounded-full bg-white text-[12px] font-bold" style={{ color: couleur }}>
          {score}
        </span>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: couleur }}>
        {score >= 75 ? "Fort" : score >= 50 ? "Moyen" : "Faible"}
      </span>
    </div>
  );
}
