import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Speaker } from "./data";

function Tags({ tags, small }: { tags: string[]; small?: boolean }) {
  return (
    <div className={`flex flex-wrap ${small ? "gap-1" : "gap-1.5"}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full bg-[var(--sane-green-light)] font-bold text-[var(--sane-green)] ${
            small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[10px]"
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

const arrowBtn =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--sane-border)] text-[var(--sane-green)] transition-colors hover:bg-[var(--sane-green)] hover:text-white";

/** Speaker as a card (grid view) or as a row (list view). */
export function SpeakerCard({ speaker, view }: { speaker: Speaker; view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-[var(--sane-border)] bg-white p-4 transition-shadow hover:shadow-md">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--sane-background)]">
          <Image src={speaker.img} alt={speaker.name} fill sizes="64px" className="object-cover object-top" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="sane-h3">{speaker.name}</p>
          <p className="sane-small mb-1.5">
            {speaker.title} — {speaker.org}
          </p>
          <Tags tags={speaker.tags} small />
        </div>
        <button type="button" aria-label={`Voir ${speaker.name}`} className={arrowBtn}>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--sane-border)] bg-white transition-shadow hover:shadow-lg">
      <div className="relative h-[200px] overflow-hidden bg-[var(--sane-background)]">
        <Image
          src={speaker.img}
          alt={speaker.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="sane-h3">{speaker.name}</p>
        <p className="text-[length:var(--fs-small)] font-semibold text-[var(--sane-green)]">{speaker.title}</p>
        <p className="sane-small">{speaker.org}</p>
        <Tags tags={speaker.tags} />
        <div className="mt-auto pt-3">
          <button type="button" aria-label={`Voir ${speaker.name}`} className={arrowBtn}>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
