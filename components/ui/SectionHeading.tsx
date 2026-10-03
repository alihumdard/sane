interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className = "",
}: SectionHeadingProps) {
  const onLight = tone === "dark";

  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <div className={`mb-1.5 flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}>
          <span className="h-[3px] w-8 rounded-full bg-[var(--sane-orange)]" />
          <span
            className={`text-[10px] font-extrabold uppercase tracking-[0.12em] sm:text-[11px] ${
              onLight ? "text-[var(--sane-green)]" : "text-white/80"
            }`}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <h2
        className={`text-[22px] font-extrabold leading-[1.12] tracking-tight sm:text-[26px] md:text-[30px] ${
          onLight ? "text-[var(--sane-text)]" : "text-white"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-2 text-[13px] leading-[1.65] sm:text-[14px] ${
            onLight ? "text-[var(--sane-text)] opacity-60" : "text-white/60"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
