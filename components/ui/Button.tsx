import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
  as?: "button";
}

const VARIANT_STYLES: Record<string, string> = {
  primary:
    "bg-terracotta text-cream hover:bg-terracotta/90 shadow-sm shadow-terracotta/20",
  secondary:
    "bg-white text-ink border border-ink/15 hover:border-ink/30 hover:bg-ink/[0.02]",
  ghost: "text-ink/60 hover:text-ink hover:bg-ink/5",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

const SIZE_STYLES: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  target,
}: {
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
  target?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
    >
      {icon}
      {children}
    </a>
  );
}
