import Image from "next/image";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  imageSrc: string;
  variant?: "dark" | "light";
  actionButton?: ReactNode;
}

export default function HeroBanner({ title, description, imageSrc, variant = "light", actionButton }: Props) {
  if (variant === "dark") {
    return (
      <div className="relative mb-4 h-[160px] overflow-hidden rounded-2xl bg-[var(--sane-green-deep)]">
        <div className="absolute right-0 top-0 h-full w-[55%]">
          <Image src={imageSrc} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--sane-green-deep)] via-[var(--sane-green-deep)]/40 to-transparent" />
        </div>
        <div className="absolute right-32 top-1/2 -translate-y-1/2 opacity-30">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="white" opacity="0.2" />
            <text x="40" y="46" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">SANE</text>
          </svg>
        </div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-right">
          <p className="text-[22px] italic font-bold text-white leading-snug" style={{ fontFamily: "Georgia, serif" }}>
            Un Niger<br />de Talents
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="text-[26px] font-extrabold text-white leading-tight">{title}</h1>
          <p className="mt-1 max-w-[420px] text-[11px] text-white/80 leading-relaxed">{description}</p>
        </div>
        {actionButton && <div className="absolute right-10 bottom-6">{actionButton}</div>}
      </div>
    );
  }

  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl bg-white border border-[var(--sane-border)]">
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col justify-center px-5 sm:px-8 py-5 sm:py-6 relative z-10 sm:min-w-[45%]">
          <h1 className="text-[22px] sm:text-[28px] font-extrabold text-[var(--sane-green-deep)] leading-tight">{title}</h1>
          <p className="mt-2 max-w-[420px] text-[12px] text-[var(--sane-text-light)] leading-relaxed">{description}</p>
        </div>
        <div className="relative flex-1 min-h-[150px]">
          <Image src={imageSrc} alt={title} fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
          <div className="absolute right-24 top-1/2 -translate-y-1/2 opacity-20">
            <svg width="70" height="70" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="#10632D" opacity="0.3" />
              <text x="40" y="46" textAnchor="middle" fill="#10632D" fontSize="14" fontWeight="800">SANE</text>
            </svg>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-right">
            <p className="text-[20px] italic font-bold text-[var(--sane-green)] leading-snug" style={{ fontFamily: "Georgia, serif" }}>
              Un Niger<br />de Talents
            </p>
          </div>
        </div>
      </div>
      {actionButton && <div className="absolute right-10 bottom-6 z-10">{actionButton}</div>}
    </div>
  );
}
