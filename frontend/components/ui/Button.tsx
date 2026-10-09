import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[var(--sane-orange)] text-white hover:bg-[var(--sane-orange-dark)]",
    secondary:
      "bg-[var(--sane-green)] text-white hover:bg-[var(--sane-green-dark)]",
    outline:
      "border border-[var(--sane-green)] bg-white text-[var(--sane-green)] hover:bg-[var(--sane-green)] hover:text-white",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}