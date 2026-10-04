import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Mail, MapPin } from "lucide-react";
import { textLink } from "@/components/ui/styles";
import { NewsletterForm, imageFocus } from "@/components/shared";
import { popularArticles, upcomingEvents } from "./data";

function SideTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="h-px w-4 bg-[var(--sane-orange)]" />
      <h3 className="sane-h3">{children}</h3>
    </div>
  );
}

export function NewsSidebar() {
  return (
    <aside className="flex flex-col gap-8">
      <div>
        <SideTitle>Articles populaires</SideTitle>
        <div className="flex flex-col gap-4">
          {popularArticles.map((pa) => (
            <Link key={pa.title} href="#" className="group flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <Image src={pa.image} alt="" fill sizes="56px" className="object-cover" style={{ objectPosition: imageFocus(pa.image) }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[length:var(--fs-small)] font-semibold leading-snug text-[var(--sane-text)] transition-colors group-hover:text-[var(--sane-green)]">
                  {pa.title}
                </p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[var(--sane-orange)]">
                  <Calendar size={11} />
                  {pa.date}
                </span>
              </div>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--sane-border)] text-[var(--sane-text-light)] transition-colors group-hover:border-[var(--sane-green)] group-hover:text-[var(--sane-green)]">
                <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <SideTitle>Prochains événements</SideTitle>
        <div className="flex flex-col gap-3">
          {upcomingEvents.map((ev) => (
            <div key={ev.title} className="rounded-xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-3.5">
              <p className="text-[length:var(--fs-small)] font-semibold text-[var(--sane-text)]">{ev.title}</p>
              <div className="sane-small mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar size={11} className="text-[var(--sane-orange)]" />
                  {ev.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-[var(--sane-orange)]" />
                  {ev.location}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/programme" className={`${textLink} mt-3`}>
          Voir tous les événements <ArrowRight size={13} />
        </Link>
      </div>

      <div className="rounded-2xl border border-[var(--sane-border)] bg-[var(--sane-background)] p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sane-orange)] text-white">
            <Mail size={16} />
          </span>
          <h3 className="sane-h3">Abonnez-vous à notre newsletter</h3>
        </div>
        <p className="sane-small mb-4">Recevez nos dernières actualités et événements directement dans votre boîte mail.</p>
        <NewsletterForm />
      </div>
    </aside>
  );
}
