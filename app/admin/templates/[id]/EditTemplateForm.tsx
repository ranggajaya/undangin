"use client";

import { TemplateForm } from "@/components/admin/TemplateForm";
import { updateTemplate } from "@/lib/actions/admin-templates";

interface TemplateRow {
  id: string;
  slug: string;
  name: string | null;
  kategori: string;
  thumbnail_url: string | null;
  default_theme_config: Record<string, unknown>;
  is_active: boolean;
}

export function EditTemplateForm({ template }: { template: TemplateRow }) {
  return (
    <TemplateForm
      initialValues={{
        slug: template.slug,
        name: template.name ?? "",
        kategori: template.kategori,
        thumbnailUrl: template.thumbnail_url ?? "",
        defaultThemeConfig: JSON.stringify(
          template.default_theme_config,
          null,
          2
        ),
        isActive: template.is_active,
      }}
      onSubmit={(input) => updateTemplate(template.id, input)}
      submitLabel="Simpan Perubahan"
    />
  );
}
