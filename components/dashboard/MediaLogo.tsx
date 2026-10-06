import React from "react";

export default function MediaLogo({ source }: { source: string }) {
  const logos: Record<string, React.ReactNode> = {
    "RTN Niger": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DC2626]">
        <span className="text-[6px] font-extrabold text-white leading-none">RTN</span>
      </div>
    ),
    "Télé Sahel": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0891B2]">
        <span className="text-[5px] font-extrabold text-white leading-none">TéléS</span>
      </div>
    ),
    "Le Sahel": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sane-green)]">
        <span className="text-[6px] font-extrabold text-white">LS</span>
      </div>
    ),
    "Niger24": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sane-orange)]">
        <span className="text-[6px] font-extrabold text-white">N24</span>
      </div>
    ),
    "Radio Nationale": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7C3AED]">
        <span className="text-[5px] font-extrabold text-white">Radio</span>
      </div>
    ),
    "ORTN": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]">
        <span className="text-[6px] font-extrabold text-white">ORTN</span>
      </div>
    ),
    "L'Observateur": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#059669]">
        <span className="text-[5px] font-extrabold text-white">LObs</span>
      </div>
    ),
    "ActuNiger": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D97706]">
        <span className="text-[5px] font-extrabold text-white">Actu</span>
      </div>
    ),
    "Bonferey FM": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DB2777]">
        <span className="text-[5px] font-extrabold text-white">BFM</span>
      </div>
    ),
    "RFI Afrique": (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399]">
        <span className="text-[5px] font-extrabold text-white">RFI</span>
      </div>
    ),
  };

  return (
    <>
      {logos[source] || (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sane-background)] border border-[var(--sane-border)]">
          <span className="text-[6px] font-bold text-[var(--sane-text-light)]">{source.substring(0, 3)}</span>
        </div>
      )}
    </>
  );
}
