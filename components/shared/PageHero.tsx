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
  /** CSS object-position value, e.g. "center", "right center", "top". Defaults to "center". */
  imagePosition?: string;
  actions?: HeroAction[];
  stats?: HeroStat[];
  floatingCardText?: string;
  tagline?: string;
}

export function PageHero({
  breadcrumb,
  eyebrow,
  title,
  lead,
  description,
  image,
  tone = "dark",
  imagePosition = "center",
  actions = [],
  stats = [],
  floatingCardText,
  tagline,
}: PageHeroProps) {
  const isDark = tone === "dark";

  return (
    <section className="relative min-h-[520px] overflow-hidden sm:min-h-[450px] lg:min-h-[400px]">
      <Image src={image} alt="" fill priority className="object-cover" style={{ objectPosition: imagePosition }} sizes="100vw" />
      {isDark ? (
        <div className="absolute inset-0 bg-[#0a4a22]/70 lg:bg-gradient-to-r lg:from-[#0a4a22]/90 lg:via-[#0a4a22]/40 lg:to-transparent lg:to-[55%]" />
      ) : (
        <div className="absolute inset-0 bg-white/25 lg:bg-white/15" />
      )}

      <Container className="relative z-10">
        {/* Breadcrumb */}
        {isDark ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/99 px-4 py-1.5 text-[12px] backdrop-blur-sm sm:mt-10 sm:px-5 sm:py-2 sm:text-[13px]">
            <Link href="/" className="font-medium text-[var(--sane-green)] transition-colors hover:text-[#0a4a22]">Accueil</Link>
            <ChevronRight size={16} className="text-[var(--sane-text-light)]" />
            <span className="font-bold text-[var(--sane-orange)]">{breadcrumb}</span>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-1.5 text-[12px] sm:mt-8 sm:text-[13px]">
            <Link href="/" className="font-medium text-[var(--sane-text-light)] transition-colors hover:text-[var(--sane-green)]">Accueil</Link>
            <ChevronRight size={14} className="text-[var(--sane-text-light)]" />
            <span className="font-medium text-[var(--sane-text-light)]">{breadcrumb}</span>
          </div>
        )}

        <div className={`relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 ${isDark ? "min-h-[380px] pb-8 pt-4 sm:pb-10 sm:pt-6" : "min-h-[260px] pb-6 pt-3 sm:pb-8 sm:pt-4"}`}>
          {/* Floating card — top right, light tone only */}
          {!isDark && (
            <div className="absolute right-0 top-0 hidden w-[130px] rounded-xl bg-white/95 px-3.5 py-3.5 shadow-lg ring-1 ring-[var(--sane-border)] backdrop-blur-sm lg:block">
              <p className="whitespace-pre-line text-[9px] font-extrabold uppercase leading-[1.7] tracking-wide text-[var(--sane-green)]">
                {floatingCardText ?? "Des compétences\npour un Niger\nplus fort"}
              </p>
              <div className="mt-2 h-[2.5px] w-6 rounded-full bg-[var(--sane-orange)]" />
            </div>
          )}
          {/* Tagline — bottom right, light tone only */}
          {!isDark && tagline && (
            <div className="absolute bottom-6 right-0 hidden text-right lg:block">
              <p className="font-serif text-[15px] italic leading-[1.2] text-[var(--sane-orange)]">{tagline}</p>
              <div className="ml-auto mt-1.5 h-[2.5px] w-10 rounded-full bg-[var(--sane-orange)]" />
            </div>
          )}
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
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
              className={`font-extrabold leading-[1.08] tracking-tight ${
                isDark
                  ? "text-[26px] sm:text-[36px] md:text-[42px] lg:text-[48px] text-white"
                  : "text-[24px] sm:text-[30px] md:text-[36px] lg:text-[38px] text-[var(--sane-green)]"
              }`}
            >
              {title}
            </h1>

            <p
              className={`max-w-[500px] font-semibold leading-7 ${
                isDark
                  ? "mt-4 text-[14px] sm:text-[15px] text-white/90"
                  : "mt-2 text-[13px] sm:text-[14px] text-[var(--sane-green)]"
              }`}
            >
              {lead}
            </p>

            {description && (
              <p
                className={`mt-2 max-w-[500px] text-[13px] leading-6 sm:text-[14px] ${
                  isDark ? "text-white/70" : "text-[var(--sane-text-light)]"
                }`}
              >
                {description}
              </p>
            )}

            {actions.length > 0 && (
              <div className={`flex flex-wrap gap-3 ${isDark ? "mt-6 sm:mt-8" : "mt-4 sm:mt-5"}`}>
                {actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`group inline-flex w-fit items-center justify-center gap-2 font-bold transition-all ${
                      isDark
                        ? "h-[44px] rounded-full px-7 text-[13px] shadow-lg hover:shadow-xl sm:h-[46px] sm:px-8 sm:text-[14px]"
                        : "h-[38px] rounded-lg px-5 text-[13px] sm:h-[40px] sm:px-6"
                    } ${
                      action.variant !== "secondary"
                        ? "bg-[var(--sane-orange)] text-white shadow-orange-900/20 hover:bg-[#CF6812]"
                        : isDark
                          ? "bg-white/95 text-[var(--sane-green)] backdrop-blur-sm hover:bg-white"
                          : "border border-[var(--sane-green)] bg-white text-[var(--sane-green)] hover:bg-[#f0faf4]"
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
        </div> {/* end inner grid */}
      </Container>
    </section>
  );
}
