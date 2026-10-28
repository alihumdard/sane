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

/**
 * News / press article card (image with date + tag, title, excerpt, link).
 *
 * No destination, no link: the press page showed three "Lire l'article"
 * buttons pointing at "#", because the records behind them carry neither a
 * media URL nor a file.
 */
export function ArticleCard({ image, date, tag, tagColor, title, description, href }: ArticleCardData) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-[190px] w-full overflow-hidden">
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
        {/*
          Hidden through a style rather than a class: `textLink` carries
          `inline-flex`, which beat Tailwind's `hidden` depending on the order
          the two landed in the stylesheet — so a card with no destination
          still showed a link, and an empty href sends the reader back to the
          page they are already on.
        */}
        <Link
          href={href ?? "#"}
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
          style={href ? undefined : { display: "none" }}
          aria-hidden={href ? undefined : true}
          tabIndex={href ? undefined : -1}
          className={`${textLink} mt-auto w-fit`}
        >
          Lire l&apos;article <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
