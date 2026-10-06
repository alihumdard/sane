import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { textLink } from "@/components/ui/styles";
import { imageFocus } from "./imageFocus";

export interface ArticleCardData {
  image: string;
  date: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  href?: string;
}

/** News / press article card (image with date + tag, title, excerpt, link). */
export function ArticleCard({ image, date, tag, tagColor, title, description, href = "#" }: ArticleCardData) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-[190px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 28vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: imageFocus(image) }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-white">
            <Calendar size={13} />
            {date}
          </span>
          <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white" style={{ backgroundColor: tagColor }}>
            {tag}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="sane-h3 mb-2">{title}</h3>
        <p className="sane-small mb-4 line-clamp-3">{description}</p>
        <Link href={href} className={`${textLink} mt-auto w-fit`}>
          Lire l&apos;article <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
