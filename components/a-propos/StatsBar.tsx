import { CalendarDays, MapPin, UsersRound, Mic } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface InfoItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const infoItems: InfoItem[] = [
  { icon: CalendarDays, title: "Date", description: "À confirmer" },
  { icon: MapPin, title: "Lieu", description: "Niamey, Niger" },
  { icon: UsersRound, title: "Participants", description: "+1000 attendus" },
  { icon: Mic, title: "Sessions", description: "Conférences, formations, réseautage, recrutement" },
];

export function StatsBar() {
  return (
    <div className="border-b border-[var(--sane-border)] bg-white shadow-sm">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {infoItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-3 py-4 px-2 sm:gap-4 sm:py-5 md:py-5 ${i !== 0 ? "border-t border-[var(--sane-border)] sm:border-t-0" : ""} ${i === 1 || i === 3 ? "sm:border-l sm:border-[var(--sane-border)] sm:pl-6 md:pl-8" : ""} ${i === 2 ? "lg:border-l lg:border-[var(--sane-border)] lg:pl-8" : ""}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--sane-orange)] text-[var(--sane-orange)] sm:h-11 sm:w-11 md:h-12 md:w-12">
                  <Icon size={18} strokeWidth={1.8} className="sm:hidden" />
                  <Icon size={20} strokeWidth={1.8} className="hidden sm:block md:hidden" />
                  <Icon size={22} strokeWidth={1.8} className="hidden md:block" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[var(--sane-text)] sm:text-[14px] md:text-[15px] lg:text-[16px]">{item.title}</p>
                  <p className="text-[11px] leading-snug text-[var(--sane-text-light)] sm:text-[12px] md:text-[13px]">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
