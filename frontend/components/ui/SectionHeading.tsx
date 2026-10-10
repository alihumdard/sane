import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  /** Optional icon displayed next to the title */
  icon?: LucideIcon;
  align?: "left" | "center";
  tone?: "dark" | "light";
  /** Max width for the description text (default: max-w-2xl) */
  descriptionWidth?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
  align = "left",
  tone = "dark",
  descriptionWidth = "max-w-2xl",
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

      <h2 className={`sane-h2 ${dark}`}>
        {Icon && (
          <Icon
            size={22}
            strokeWidth={2.2}
            className="mr-2 inline-block align-[-3px] text-[var(--sane-orange)]"
          />
        )}
        {title}
      </h2>

      {description && <p className={`sane-body mt-3 ${descriptionWidth} ${dark}`}>{description}</p>}
    </div>
  );
}
