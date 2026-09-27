interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#10632D]">
          <span className="h-1 w-5 rounded-full bg-[#E57617]" />
          {eyebrow}
        </div>
      )}

      <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#10231A] md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-7 text-[#61756B] md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}