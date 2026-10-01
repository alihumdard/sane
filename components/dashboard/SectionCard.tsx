import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  viewAllText?: string;
  children: ReactNode;
}

export default function SectionCard({ icon, title, viewAllText, children }: Props) {
  return (
    <div className="rounded-xl border border-[#DDE8E0] bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[12px] font-bold text-[#0a2e16]">{title}</span>
        </div>
        {viewAllText && (
          <button className="flex items-center gap-0.5 text-[10px] font-semibold text-[#E57617]">
            {viewAllText} <ChevronRight size={10} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
