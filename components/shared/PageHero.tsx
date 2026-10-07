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
}: PageHeroProps) {
  const isDark = tone === "dark";
  const photo = imageFit === "photo";
  const light = overlayStrength === "light";

  return (
    <section
      className={`relative overflow-hidden lg:min-h-[400px] ${isDark ? "bg-[var(--sane-green-dark)]" : "bg-[var(--sane-background)]"}`}
    >
      {/* Artwork: always the full-bleed background (full width and height of the hero) */}
      {/* wide banners fill the hero; square/portrait photos sit in the right 55% on desktop so they are not zoomed and cut */}
      <div className={`absolute inset-0 ${photo ? "lg:left-auto lg:w-[55%]" : ""}`}>
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes={photo ? "(min-width: 1024px) 55vw, 100vw" : "100vw"}
          className={`object-cover ${photo ? "" : "object-[78%_center] lg:object-center"}`}
          style={photo || imagePosition ? { objectPosition: imagePosition ?? imageFocus(image, "center 20%") } : undefined}
        />
        {photo && (
          <div
            className={`absolute inset-0 hidden bg-gradient-to-r to-transparent to-[60%] lg:block ${
              isDark
                ? "from-[var(--sane-green-dark)] via-[var(--sane-green-dark)]/40"
                : "from-[var(--sane-background)] via-[var(--sane-background)]/40"
            }`}
          />
        )}
      </div>
      {/* Readability overlay: from the top on mobile (text sits on top, artwork shows below), from the left on desktop */}
      {isDark ? (
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            light
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

        <div className={`relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 ${isDark ? "pb-8 pt-4 sm:pb-10 sm:pt-6 lg:min-h-[380px]" : "pb-6 pt-3 sm:pb-8 sm:pt-4 lg:min-h-[300px]"}`}>
          {/* Floating card + tagline — right side, light tone only */}
          {!isDark && (
            <div className="absolute right-0 top-0 hidden flex-col items-end gap-4 lg:flex lg:right-[-40px]">
              <div className="w-[155px] rounded-xl bg-white/95 px-4 py-4 shadow-lg ring-1 ring-[var(--sane-border)] backdrop-blur-sm">
                <p className="whitespace-pre-line text-[10px] font-extrabold uppercase leading-[1.8] tracking-wide text-[var(--sane-green)]">
                  {floatingCardText ?? "Des compétences\npour un Niger\nplus fort"}
                </p>
                <div className="mt-2 h-[2.5px] w-6 rounded-full bg-[var(--sane-orange)]" />
              </div>
              {tagline && (
                <div className="text-right">
                  <p className="whitespace-pre-line font-serif text-[24px] italic leading-[1.35] text-[var(--sane-green)] [text-shadow:0_1px_8px_rgba(255,255,255,0.9)]">{tagline}</p>
                  <div className="ml-auto mt-2 h-[2.5px] w-10 rounded-full bg-[var(--sane-orange)]" />
                </div>
              )}
            </div>
          )}
          {/* Tagline mobile — bottom right, light tone only */}
          {!isDark && tagline && (
            <div className="absolute bottom-4 right-0 text-right lg:hidden">
              <p className="whitespace-pre-line font-serif text-[18px] italic leading-[1.35] text-[var(--sane-green)] [text-shadow:0_1px_8px_rgba(255,255,255,0.9)] sm:text-[20px]">{tagline}</p>
              <div className="ml-auto mt-1.5 h-[2px] w-8 rounded-full bg-[var(--sane-orange)]" />
            </div>
          )}
          <div className={`min-w-0 ${!isDark && tagline ? "pr-[120px] sm:pr-[140px] lg:pr-0" : ""}`}>
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
