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
                <Icon size={28} strokeWidth={1.8} className={`shrink-0 sm:h-8 sm:w-8 ${i % 2 === 0 ? "text-[var(--sane-green)]" : "text-[var(--sane-orange)]"}`} />
                <div>
                  <p className="text-[16px] font-extrabold leading-tight text-[var(--sane-green)] sm:text-[18px] md:text-[20px]">
                    {item.description}
                  </p>
                  <p className="text-[11px] leading-snug text-[var(--sane-text-light)] sm:text-[12px] md:text-[13px]">
                    {item.title}
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
