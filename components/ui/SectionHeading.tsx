interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
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
  const dark = tone === "light" ? "on-dark" : "";

  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <div className={`mb-2 flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}>
          <span className="sane-eyebrow-bar" />
          <span className={`sane-eyebrow ${dark}`}>{eyebrow}</span>
        </div>
      )}

      <h2 className={`sane-h2 ${dark}`}>{title}</h2>

      {description && <p className={`sane-body mt-3 ${dark}`}>{description}</p>}
    </div>
  );
}
