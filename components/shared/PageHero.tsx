import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { imageFocus } from "./imageFocus";

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
  title: React.ReactNode;
  lead: string;
  description?: string;
  image: string;
  /** "dark" tints the image and uses white text; "light" keeps the artwork visible with dark text. */
  tone?: "dark" | "light";
  /** CSS object-position value, e.g. "center", "right center", "top". Defaults to "center". */
  imagePosition?: string;
  /**
   * Kind of artwork, used to focus the background on mobile:
   * "banner" – wide 3:1 artwork (subject on the right) · "photo" – square/portrait photo.
   */
  imageFit?: "photo" | "banner";
  actions?: HeroAction[];
  stats?: HeroStat[];
  floatingCardText?: string;
  tagline?: string;
  /** Lighten the dark overlay so the background artwork shows through more. */
  overlayStrength?: "normal" | "light";
  /** Richer gradient plus decorative curves, and a softer blend into the photo. */
  premium?: boolean;
}

export function PageHero({
  breadcrumb,
  eyebrow,
  title,
  lead,
  description,
  image,
  tone = "dark",
  imagePosition,
  imageFit = "photo",
  actions = [],
  stats = [],
  floatingCardText,
  tagline,
  overlayStrength = "normal",
  premium = false,
}: PageHeroProps) {
  const isDark = tone === "dark";
  const photo = imageFit === "photo";
  const light = overlayStrength === "light";

  return (
    <section
      className={`relative overflow-hidden lg:min-h-[400px] ${isDark ? "bg-[var(--sane-green-dark)]" : "bg-[var(--sane-background)]"}`}
    >
      {/* Premium: layered green gradient base behind everything */}
      {premium && isDark && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, #06331a 0%, #0a4a24 38%, #10632d 68%, #14773a 100%)",
          }}
        />
      )}

      {/* Artwork: always the full-bleed background (full width and height of the hero) */}
      {/* wide banners fill the hero; square/portrait photos sit in the right 55% on desktop so they are not zoomed and cut */}
      <div className={`absolute inset-0 ${photo ? (premium ? "lg:left-auto lg:w-[58%]" : "lg:left-auto lg:w-[55%]") : ""}`}>
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes={photo ? "(min-width: 1024px) 58vw, 100vw" : "100vw"}
          className={`object-cover ${photo ? "" : "object-[78%_center] lg:object-center"} ${premium ? "lg:brightness-[1.04] lg:contrast-[1.06] lg:saturate-[1.05]" : ""}`}
          style={photo || imagePosition ? { objectPosition: imagePosition ?? imageFocus(image, "center 20%") } : undefined}
        />
        {photo && (
          <div
            className={`absolute inset-0 hidden bg-gradient-to-r lg:block ${
              premium
                ? "from-[#06331a] via-[#0a4a24]/70 via-[32%] to-transparent to-[72%]"
                : isDark
                  ? "from-[var(--sane-green-dark)] via-[var(--sane-green-dark)]/40 to-transparent to-[60%]"
                  : "from-[var(--sane-background)] via-[var(--sane-background)]/40 to-transparent to-[60%]"
            }`}
          />
        )}
        {/* Premium: soft vertical vignette so the photo sits in the frame instead of being cut */}
        {premium && photo && (
          <div className="absolute inset-0 hidden bg-gradient-to-b from-[#06331a]/35 via-transparent to-[#06331a]/30 lg:block" />
        )}
      </div>

      {/* Premium: decorative abstract curves + dot texture */}
      {premium && isDark && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 440">
            <defs>
              <linearGradient id="hero-curve-a" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hero-curve-b" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#e57617" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#e57617" stopOpacity="0" />
              </linearGradient>
              <pattern id="hero-dots" width="26" height="26" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#ffffff" fillOpacity="0.16" />
              </pattern>
            </defs>
            <path d="M-120 440 C 180 300, 300 140, 240 -40 L -200 -40 Z" fill="url(#hero-curve-a)" />
            <path
              d="M560 -60 C 700 120, 660 300, 820 500"
              fill="none"
              stroke="url(#hero-curve-b)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M470 -40 C 600 140, 560 320, 710 520"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.07"
              strokeWidth="1.5"
            />
            <rect x="40" y="250" width="150" height="130" fill="url(#hero-dots)" />
            <circle cx="150" cy="80" r="110" fill="#ffffff" fillOpacity="0.025" />
          </svg>
        </div>
      )}
      {/* Readability overlay: from the top on mobile (text sits on top, artwork shows below), from the left on desktop */}
      {isDark ? (
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            premium
              ? "from-[#06331a]/92 via-[#0a4a24]/78 to-[#10632d]/55"
              : light
                ? "from-[var(--sane-green-dark)]/80 via-[var(--sane-green-dark)]/55 to-[var(--sane-green-dark)]/30"
                : "from-[var(--sane-green-dark)]/90 via-[var(--sane-green-dark)]/75 to-[var(--sane-green-dark)]/55"
          } ${
            photo
              ? "lg:hidden"
              : light
                ? "lg:bg-gradient-to-r lg:from-[var(--sane-green-dark)]/75 lg:via-[var(--sane-green-dark)]/25 lg:to-transparent lg:to-[55%]"
                : "lg:bg-gradient-to-r lg:from-[var(--sane-green-dark)]/90 lg:via-[var(--sane-green-dark)]/40 lg:to-transparent lg:to-[55%]"
          }`}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-b from-[var(--sane-background)]/95 via-[var(--sane-background)]/80 to-[var(--sane-background)]/60 ${
            photo ? "lg:hidden" : "lg:bg-white/15 lg:bg-none"
          }`}
        />
      )}

      <Container className="relative z-10">
        {/* Breadcrumb */}
        {isDark ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/99 px-4 py-1.5 text-[12px] backdrop-blur-sm sm:mt-10 sm:px-5 sm:py-2 sm:text-[13px]">
            <Link href="/" className="font-medium text-[var(--sane-green)] transition-colors hover:text-[var(--sane-green-dark)]">Accueil</Link>
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

        <div className={`relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 ${isDark ? "pb-8 pt-4 sm:pb-10 sm:pt-6 lg:min-h-[380px]" : "pb-6 pt-3 sm:pb-8 sm:pt-4 lg:min-h-[260px]"}`}>
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
              <span className={`sane-eyebrow ${isDark ? "on-dark" : ""}`}>
                {eyebrow}
              </span>
            </div>

            <h1 className={`sane-h1 ${isDark ? "on-dark" : "!text-[var(--sane-green)]"}`}>
              {title}
            </h1>

            <p
              className={`sane-lead max-w-[520px] ${isDark ? "on-dark mt-4" : "mt-2"}`}
            >
              {lead}
            </p>

            {description && (
              <p
                className={`sane-body mt-2 max-w-[520px] ${isDark ? "on-dark" : ""}`}
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
                        ? "bg-[var(--sane-orange)] text-white shadow-orange-900/20 hover:bg-[var(--sane-orange-dark)]"
                        : isDark
                          ? "bg-white/95 text-[var(--sane-green)] backdrop-blur-sm hover:bg-white"
                          : "border border-[var(--sane-green)] bg-white text-[var(--sane-green)] hover:bg-[var(--sane-green-light)]"
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
