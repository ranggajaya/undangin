import type { ReactNode } from "react";

const TONE_STYLES: Record<string, string> = {
  sage: "bg-sage/10 text-sage",
  terracotta: "bg-terracotta/10 text-terracotta",
  neutral: "bg-ink/[0.06] text-ink/60",
  red: "bg-red-50 text-red-600",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "sage" | "terracotta" | "neutral" | "red";
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}
