import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { TemplateMeta, TemplateProps } from "./types";
import { roseaMinimalTheme } from "./rosea-minimal/theme";

// Tambahkan entry baru di sini setiap kali ada desain baru.
// `id` HARUS sama dengan kolom `id` di tabel `templates` (Supabase).
export const templateRegistry: Record<
  string,
  {
    meta: Omit<TemplateMeta, "id">;
    component: ComponentType<TemplateProps>;
  }
> = {
  "rosea-minimal": {
    meta: {
      name: "Rosea Minimal",
      category: "minimalis",
      thumbnailUrl: "/templates/rosea-minimal/thumbnail.jpg",
      defaultTheme: roseaMinimalTheme,
    },
    component: dynamic(() => import("./rosea-minimal"), {
      loading: () => <TemplateLoadingFallback />,
    }),
  },
  // "sanding-elegan": { ... }  <- contoh slot untuk template ke-2
  // "kebun-senja": { ... }     <- contoh slot untuk template ke-3
};

export function getTemplate(templateId: string) {
  return templateRegistry[templateId] ?? null;
}

export function listTemplatesByCategory(category?: string) {
  const entries = Object.entries(templateRegistry);
  const filtered = category
    ? entries.filter(([, t]) => t.meta.category === category)
    : entries;
  return filtered.map(([id, t]) => ({ id, ...t.meta }));
}

function TemplateLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <p className="text-sm text-ink/50">Memuat desain...</p>
    </div>
  );
}
