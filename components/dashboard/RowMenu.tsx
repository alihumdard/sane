"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RowMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  dividerBefore?: boolean;
}

interface Props {
  items: RowMenuItem[];
  label?: string;
  size?: number;
  className?: string;
}

const MENU_WIDTH = 200;
const ITEM_HEIGHT = 34;

/** Three-dot button that opens a floating action menu (fixed-positioned, so tables with overflow don't clip it). */
export default function RowMenu({ items, label = "Plus d'actions", size = 13, className = "text-[var(--sane-text-light)] hover:opacity-80" }: Props) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-row-menu]")) close();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [pos]);

  function toggle() {
    if (pos) return setPos(null);
    const rect = btn.current?.getBoundingClientRect();
    if (!rect) return;
    const height = items.length * ITEM_HEIGHT + 8;
    const left = Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8));
    const below = rect.bottom + 4;
    const top = below + height > window.innerHeight - 8 ? Math.max(8, rect.top - height - 4) : below;
    setPos({ top, left });
  }

  return (
    <>
      <button
        ref={btn}
        type="button"
        data-row-menu
        title={label}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={!!pos}
        onClick={toggle}
        className={className}
      >
        <MoreVertical size={size} />
      </button>

      {pos && (
        <div
          data-row-menu
          role="menu"
          style={{ position: "fixed", top: pos.top, left: pos.left, width: MENU_WIDTH }}
          className="z-[80] rounded-lg border border-[var(--sane-border)] bg-white py-1 text-left shadow-xl"
        >
          {items.map((item) => (
            <div key={item.label}>
              {item.dividerBefore && <div className="my-1 border-t border-[var(--sane-border)]" />}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setPos(null);
                  item.onClick();
                }}
                className={`flex w-full items-center gap-2.5 px-3 text-left text-[12px] font-medium transition-colors hover:bg-[var(--sane-background)] ${
                  item.danger ? "text-[var(--sane-red)]" : "text-[var(--sane-text)]"
                }`}
                style={{ height: ITEM_HEIGHT }}
              >
                {item.icon && <item.icon size={14} className="shrink-0" />}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
