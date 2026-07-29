import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl text-ink">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-ink/55">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink/15 bg-ink/[0.015] px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
        {icon}
      </div>
      <p className="mb-1 text-sm font-medium text-ink">{title}</p>
      <p className="mb-5 max-w-xs text-sm text-ink/50">{description}</p>
      {action}
    </div>
  );
}
