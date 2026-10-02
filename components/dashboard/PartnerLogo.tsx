import React from "react";

export default function PartnerLogo({ nom }: { nom: string }) {
  const logos: Record<string, React.ReactNode> = {
    "UNICEF": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00AEEF]">
        <span className="text-[7px] font-extrabold text-white leading-none">unicef</span>
      </div>
    ),
    "Banque Mondiale": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2563EB]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.5"/><path d="M3 12h18M12 3c-3 3-4 6-4 9s1 6 4 9M12 3c3 3 4 6 4 9s-1 6-4 9" stroke="#2563EB" strokeWidth="1.2" fill="none"/></svg>
      </div>
    ),
    "AFD": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC2626]">
        <span className="text-[9px] font-extrabold text-white">AFD</span>
      </div>
    ),
    "GIZ": (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F5ED]">
        <span className="text-[11px] font-extrabold italic text-[#10632D]">giz</span>
      </div>
    ),
    "PNUD": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2563EB]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.5"/><path d="M8 8c0 0 1-2 4-2s4 2 4 2" stroke="#2563EB" strokeWidth="1" fill="none"/><path d="M6 14c1-3 3-5 6-5s5 2 6 5" stroke="#2563EB" strokeWidth="1" fill="none"/></svg>
      </div>
    ),
    "Enabel": (
      <div className="flex h-9 w-14 items-center justify-center rounded-lg border border-[#DDE8E0] bg-white">
        <span className="text-[8px] font-bold text-[#E57617]">Enabel</span>
      </div>
    ),
    "Union Européenne": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003399]">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <circle cx="9" cy="9" r="8" fill="#003399"/>
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
            const a = (i * 30 - 90) * Math.PI / 180;
            return <text key={i} x={9 + 5.5 * Math.cos(a)} y={9 + 5.5 * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fill="#FFCC00" fontSize="3">★</text>;
          })}
        </svg>
      </div>
    ),
    "OIT": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0891B2] bg-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#0891B2" strokeWidth="1.5"/><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#0891B2" strokeWidth="1.2" fill="none"/><line x1="7" y1="15" x2="17" y2="15" stroke="#0891B2" strokeWidth="1.2"/></svg>
      </div>
    ),
    "BAD (Banque Africaine)": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#059669]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="5" stroke="white" strokeWidth="1.5" fill="none"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.5" fill="none"/></svg>
      </div>
    ),
    "TotalEnergies": (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC2626]">
        <span className="text-[7px] font-extrabold text-white leading-none">Total<br/>E</span>
      </div>
    ),
  };

  return (
    <>
      {logos[nom] || (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F9F6] border border-[#DDE8E0]">
          <span className="text-[8px] font-bold text-[#61756B]">{nom.substring(0, 3)}</span>
        </div>
      )}
    </>
  );
}
