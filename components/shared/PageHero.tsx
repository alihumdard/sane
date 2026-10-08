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
  const pos = imagePosition ?? imageFocus(image, photo ? "center 20%" : "center");

  return (
    <section
      className={`relative min-h-[320px] overflow-hidden sm:min-h-0 ${isDark ? "bg-[var(--sane-green-dark)]" : "bg-[var(--sane-background)]"}`}
    >
      {/* ===== Background image (all screens) ===== */}
      <div className={`absolute inset-0 ${photo ? "lg:left-auto lg:w-[55%]" : ""}`}>
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes={photo ? "(min-width: 1024px) 55vw, 100vw" : "100vw"}
          className="object-cover"
          style={{ objectPosition: pos }}
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

      {/* Readability overlay */}
      {isDark ? (
        <div
          className={`absolute inset-0 bg-gradient-to-b from-[var(--sane-green-dark)]/70 via-[var(--sane-green-dark)]/40 via-[55%] to-[var(--sane-green-dark)]/10 ${
            photo
              ? "lg:hidden"
              : "sm:from-[var(--sane-green-dark)]/60 sm:via-[var(--sane-green-dark)]/30 sm:to-[var(--sane-green-dark)]/10 lg:bg-none lg:bg-[var(--sane-green-dark)]/20"
          }`}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-b from-[var(--sane-background)]/85 via-[var(--sane-background)]/50 via-[55%] to-[var(--sane-background)]/20 sm:from-[var(--sane-background)]/70 sm:via-[var(--sane-background)]/40 sm:to-[var(--sane-background)]/15 ${
            photo ? "lg:hidden" : "lg:bg-none lg:bg-[var(--sane-background)]/10"
          }`}
        />
      )}

      {/* ===== CONTENT ===== */}
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

        <div className={`relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 ${isDark ? "pb-6 pt-3 sm:pb-10 sm:pt-6 lg:min-h-[380px]" : "pb-5 pt-2 sm:pb-8 sm:pt-4 lg:min-h-[300px]"}`}>
          {/* Floating card + tagline — right side */}
          {(floatingCardText || tagline) && (
            <div className="absolute right-0 top-0 hidden flex-col items-end gap-4 lg:flex lg:right-[-40px]">
              {floatingCardText && (
                <div className={`w-[155px] rounded-xl px-4 py-4 shadow-lg backdrop-blur-sm ${isDark ? "bg-white/95 ring-1 ring-white/20" : "bg-white/95 ring-1 ring-[var(--sane-border)]"}`}>
                  <p className="whitespace-pre-line text-[10px] font-extrabold uppercase leading-[1.8] tracking-wide text-[var(--sane-green)]">
                    {floatingCardText}
                  </p>
                  <div className="mt-2 h-[2.5px] w-6 rounded-full bg-[var(--sane-orange)]" />
                </div>
              )}
              {tagline && (
                <div className="text-right">
                  <p className={`whitespace-pre-line font-[family-name:var(--font-caveat)] text-[22px] leading-[1.35] xl:text-[24px] ${isDark ? "text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]" : "text-[var(--sane-green)] [text-shadow:0_1px_8px_rgba(255,255,255,0.9)]"}`}>{tagline}</p>
                  <div className="ml-auto mt-2 h-[2.5px] w-10 rounded-full bg-[var(--sane-orange)]" />
                </div>
              )}
            </div>
          )}
          {/* Tagline mobile — bottom right */}
          {tagline && (
            <div className="absolute bottom-4 right-0 text-right lg:hidden">
              <p className={`whitespace-pre-line font-[family-name:var(--font-caveat)] text-[18px] leading-[1.35] sm:text-[20px] ${isDark ? "text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]" : "text-[var(--sane-green)] [text-shadow:0_1px_8px_rgba(255,255,255,0.9)]"}`}>{tagline}</p>
              <div className="ml-auto mt-1.5 h-[2px] w-8 rounded-full bg-[var(--sane-orange)]" />
            </div>
          )}
          <div className={`min-w-0 ${tagline ? "pr-[120px] sm:pr-[140px] lg:pr-0" : ""}`}>
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
              className={`sane-lead max-w-[520px] ${isDark ? "on-dark mt-2 sm:mt-4" : "mt-2"}`}
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
              <div className={`flex flex-wrap gap-3 ${isDark ? "mt-4 sm:mt-8" : "mt-3 sm:mt-5"}`}>
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
