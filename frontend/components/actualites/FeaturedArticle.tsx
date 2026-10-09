import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { primaryBtn } from "@/components/ui/styles";
import { imageFocus } from "@/components/shared";

/** "À la une" block: video-style image + highlighted story. */
export function FeaturedArticle() {
  return (
    <div className="mt-12">
      <SectionHeading eyebrow="À la une" title="Le SANEM, un engagement pour l'avenir du Niger" className="mb-6" />

      <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
        <Link href="#" aria-label="Lire la vidéo" className="group relative block h-[220px] overflow-hidden rounded-2xl">
          <Image src="/sane_deal.webp" alt="À la une" fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover" style={{ objectPosition: imageFocus("/sane_deal.webp") }} />
          <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[var(--sane-green)] shadow-lg transition-transform group-hover:scale-110">
              <Play size={24} className="ml-1" fill="currentColor" />
            </span>
          </span>
        </Link>

        <div>
          <span className="sane-small mb-2 inline-flex items-center gap-1.5 !text-[var(--sane-orange)]">
            <Calendar size={12} />
            12 Mars 2024
          </span>
          <h3 className="sane-h3 mb-3">Le SANEM 2024 : Ensemble pour un Niger plus fort</h3>
          <p className="sane-body mb-5">
            Découvrez la vision, les objectifs et les temps forts de cette nouvelle édition du Salon National de l&apos;Emploi,
            qui place les jeunes, la formation et l&apos;innovation au cœur du développement du Niger.
          </p>
          <Link href="#" className={primaryBtn}>
            Lire l&apos;article complet <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
