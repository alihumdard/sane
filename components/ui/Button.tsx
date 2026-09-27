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
      "bg-[#E57617] text-white hover:bg-[#cf6812]",
    secondary:
      "bg-[#10632D] text-white hover:bg-[#084a21]",
    outline:
      "border border-[#10632D] bg-white text-[#10632D] hover:bg-[#10632D] hover:text-white",
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