"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder: string;
  icon?: LucideIcon;
  value?: string;
  onChange?: (value: string) => void;
}

export function Select({
  options,
  placeholder,
  icon: Icon,
  value,
  onChange,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === selected)?.label;

  function handleSelect(val: string) {
    setSelected(val);
    onChange?.(val);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 w-full items-center gap-3 rounded-lg border border-[#D5E3D9] bg-white px-4 text-left transition-colors hover:border-[#10632D]/40"
      >
        {Icon && (
          <Icon size={17} className="shrink-0 text-[#71857A]" />
        )}

        <span
          className={`flex-1 truncate text-sm ${
            selected ? "text-[#17352A]" : "text-[#8A9A91]"
          }`}
        >
          {selectedLabel || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#71857A] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[220px] overflow-y-auto rounded-lg border border-[#D5E3D9] bg-white py-1 shadow-lg">
          {/* Reset / placeholder option */}
          <button
            type="button"
            onClick={() => handleSelect("")}
            className={`flex w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#F3F8F4] ${
              !selected ? "font-semibold text-[#10632D]" : "text-[#8A9A91]"
            }`}
          >
            {placeholder}
          </button>

          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#F3F8F4] ${
                selected === option.value
                  ? "bg-[#EAF5EE] font-semibold text-[#10632D]"
                  : "text-[#17352A]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
