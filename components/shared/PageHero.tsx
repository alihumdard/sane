import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface HeroStat {
  value: string;
  label: string;
}

interface HeroAction {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

interface PageHeroProps {
  breadcrumb: string;
  eyebrow: string;
  title: string;
  lead: string;
  description?: string;
  image: string;
  /** "dark" tints the image and uses white text; "light" keeps the artwork visible with dark text. */
  tone?: "dark" | "light";
  actions?: HeroAction[];
  stats?: HeroStat[];
}

export function PageHero({
  breadcrumb,
  eyebrow,
  title,
  lead,
  description,
  image,
  tone = "dark",
  actions = [],
  stats = [],
}: PageHeroProps) {
  const isDark = tone === "dark";

  return (
    <section className="relative min-h-[520px] overflow-hidden sm:min-h-[450px] lg:min-h-[400px]">
      <Image src={image} alt="" fill priority className="object-cover object-center" sizes="100vw" />
      {isDark ? (
        <div className="absolute inset-0 bg-[#0a4a22]/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#0a4a22]/85 lg:via-[#0a4a22]/50 lg:to-transparent lg:to-[60%]" />
      ) : (
        <div className="absolute inset-0 bg-white/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-white/85 lg:via-white/60 lg:to-transparent lg:to-[55%]" />
      )}

      <Container className="relative z-10">
        <div
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] backdrop-blur-sm sm:mt-10 sm:px-5 sm:py-2 sm:text-[13px] ${
            isDark ? "bg-white/99" : "bg-white/90 ring-1 ring-[var(--sane-border)]"
          }`}
        >
          <Link href="/" className="font-medium text-[var(--sane-green)] transition-colors hover:text-[#0a4a22]">
            Accueil
          </Link>
          <ChevronRight size={16} className="text-[var(--sane-text-light)]" />
          <span className="font-bold text-[var(--sane-orange)]">{breadcrumb}</span>
        </div>

        <div className="grid min-h-[380px] grid-cols-1 items-center gap-8 pb-8 pt-4 sm:pb-10 sm:pt-6 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[2px] w-6 bg-[var(--sane-orange)]" />
              <span
                className={`text-[11px] font-extrabold uppercase tracking-widest ${
                  isDark ? "text-white/80" : "text-[var(--sane-green)]"
                }`}
              >
                {eyebrow}
              </span>
            </div>

            <h1
              className={`text-[26px] font-extrabold leading-[1.08] tracking-tight sm:text-[36px] md:text-[42px] lg:text-[48px] ${
                isDark ? "text-white" : "text-[var(--sane-text)]"
              }`}
            >
              {title}
            </h1>

            <p
              className={`mt-4 max-w-[500px] text-[14px] font-semibold leading-7 sm:text-[15px] ${
                isDark ? "text-white/90" : "text-[var(--sane-text)]"
              }`}
            >
              {lead}
            </p>

            {description && (
              <p
                className={`mt-2 max-w-[500px] text-[12px] leading-6 sm:text-[13px] ${
                  isDark ? "text-white/70" : "text-[var(--sane-text)] opacity-60"
                }`}
              >
                {description}
              </p>
            )}

            {actions.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
                {actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`group inline-flex h-[44px] items-center justify-center gap-2.5 rounded-full px-7 text-[13px] font-bold shadow-lg transition-all hover:shadow-xl sm:h-[46px] sm:px-8 sm:text-[14px] ${
                      action.variant !== "secondary"
                        ? "bg-[var(--sane-orange)] text-white shadow-orange-900/20 hover:bg-[#CF6812]"
                        : isDark
                          ? "bg-white/95 text-[var(--sane-green)] backdrop-blur-sm hover:bg-white"
                          : "border border-[var(--sane-green)] bg-white text-[var(--sane-green)] hover:bg-[var(--sane-green)] hover:text-white"
                    }`}
                  >
                    {action.label}
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            )}

            {stats.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-5">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-[18px] font-extrabold text-[var(--sane-orange)]">{stat.value}</span>
                    <span
                      className={`text-[13px] font-medium ${isDark ? "text-white/80" : "text-[var(--sane-text)] opacity-70"}`}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
