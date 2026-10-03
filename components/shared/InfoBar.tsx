import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

export interface InfoItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function InfoBar({ items }: { items: InfoItem[] }) {
  return (
    <div className="border-b border-[var(--sane-border)] bg-white shadow-sm">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            const dividers = [
              i !== 0 ? "border-t border-[var(--sane-border)] sm:border-t-0" : "",
              i === 1 || i === 3 ? "sm:border-l sm:border-[var(--sane-border)] sm:pl-6 md:pl-8" : "",
              i === 2 ? "lg:border-l lg:border-[var(--sane-border)] lg:pl-8" : "",
            ].join(" ");

            return (
              <div key={item.title} className={`flex items-center gap-3 px-2 py-4 sm:gap-4 sm:py-5 ${dividers}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--sane-orange)] text-[var(--sane-orange)] sm:h-11 sm:w-11 md:h-12 md:w-12">
                  <Icon size={20} strokeWidth={1.8} className="h-[18px] w-[18px] sm:h-5 sm:w-5 md:h-[22px] md:w-[22px]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[var(--sane-text)] sm:text-[14px] md:text-[15px] lg:text-[16px]">
                    {item.title}
                  </p>
                  <p className="text-[11px] leading-snug text-[var(--sane-text-light)] sm:text-[12px] md:text-[13px]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
