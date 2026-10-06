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
              i % 2 === 1 ? "sm:border-l sm:border-[var(--sane-border)]" : "",
              i === 2 ? "lg:border-l lg:border-[var(--sane-border)]" : "",
            ].join(" ");

            return (
              <div
                key={item.title}
                className={`flex items-center justify-start gap-3.5 px-2 py-4 sm:justify-center sm:gap-4 sm:px-4 sm:py-6 ${dividers}`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
                    i % 2 === 0 ? "bg-[var(--sane-orange-light)]" : "bg-[#e8f2ec]"
                  }`}
                >
                  <Icon
                    size={24}
                    strokeWidth={2.2}
                    className={`sm:h-[26px] sm:w-[26px] ${
                      i % 2 === 0 ? "text-[var(--sane-orange)]" : "text-[var(--sane-green)]"
                    }`}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-[19px] font-extrabold leading-[1.15] tracking-tight text-[var(--sane-green)] sm:text-[21px] md:text-[23px]">
                    {item.description}
                  </p>
                  <p className="mt-0.5 whitespace-nowrap text-[12px] font-medium leading-snug text-[var(--sane-green)] sm:text-[13px]">
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
