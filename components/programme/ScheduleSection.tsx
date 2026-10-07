"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { filters, sessions, tagStyles, type Session } from "./data";

function SessionCard({ session }: { session: Session }) {
  return (
    <article className="flex flex-1 gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-[var(--sane-border)] transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
      <div className="relative hidden h-[72px] w-[110px] shrink-0 overflow-hidden rounded-lg sm:block">
        <Image src={session.image} alt="" fill className="object-cover" sizes="110px" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="sane-h3">{session.title}</h3>

          {Array.isArray(session.description) ? (
            <ul className="mt-1 flex flex-col gap-0.5">
              {session.description.map((line) => (
                <li
                  key={line}
                  className="flex gap-1.5 text-[12px] leading-[1.5] text-[var(--sane-text-light)] sm:text-[13px]"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--sane-text-light)]" />
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <p className="sane-small mt-1">
              {session.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-start gap-2 sm:flex-col sm:items-end sm:gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-[11px] ${tagStyles[session.tag]}`}
          >
            {session.tag}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap text-[10px] text-[var(--sane-text-light)] sm:text-[11px]">
            <MapPin size={11} /> {session.location}
          </span>
        </div>
      </div>
    </article>
  );
}

export function ScheduleSection() {
  const [activeFilter, setActiveFilter] = useState(filters[0].label);

  const activeTag = filters.find((f) => f.label === activeFilter)?.tag;
  const visible = activeTag ? sessions.filter((s) => s.tag === activeTag) : sessions;

  return (
    <section id="programme" className="bg-[var(--sane-background)] py-10 sm:py-12 md:py-16">
      <Container>
        <div className="flex gap-2 overflow-x-auto pb-1 pr-4 -mr-4 sm:pr-0 sm:mr-0">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.label;
            return (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[12px] font-semibold transition-colors sm:px-4 sm:text-[13px] ${
                  isActive
                    ? "border-[var(--sane-green)] bg-[var(--sane-green)] text-white"
                    : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green)] hover:text-[var(--sane-green)]"
                }`}
              >
                <Icon size={15} strokeWidth={2} />
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[var(--sane-border)] sm:mt-8 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="sane-h2">
                Programme détaillé
              </h2>
              <p className="sane-small mt-1">
                Un programme riche et varié pour inspirer, former et connecter les talents.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-[var(--sane-border)] px-3 py-2 text-[11px] font-semibold text-[var(--sane-text)] transition-colors hover:border-[var(--sane-green)] hover:text-[var(--sane-green)] sm:text-[12px]">
              Télécharger le programme PDF
              <Download size={14} />
            </button>
          </div>

          <div className="relative mt-5 sm:mt-6">
            <span className="absolute left-[110px] top-2 bottom-2 hidden w-px bg-[var(--sane-border)] sm:block" />

            <div className="flex flex-col gap-3">
              {visible.length > 0 ? (
                visible.map((session, i) => (
                  <div key={session.title} className="flex items-start gap-3 sm:gap-4">
                    <time className="hidden w-[100px] shrink-0 pt-4 text-right text-[11px] font-bold text-[var(--sane-text)] sm:block">
                      {session.time}
                    </time>
                    <span
                      className={`relative z-10 mt-4 hidden h-3 w-3 shrink-0 rounded-full ring-4 ring-white sm:block ${
                        i % 2 === 0 ? "bg-[var(--sane-green)]" : "bg-[var(--sane-orange)]"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <time className="mb-1 block text-[11px] font-bold text-[var(--sane-text)] sm:hidden">
                        {session.time}
                      </time>
                      <SessionCard session={session} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="sane-body py-10 text-center">
                  Aucune session dans cette catégorie pour le moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
