"use client";

import { TemplateForm } from "@/components/admin/TemplateForm";
import { createTemplate } from "@/lib/actions/admin-templates";

export default function NewTemplatePage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl text-ink">Template Baru</h1>
      <TemplateForm onSubmit={createTemplate} submitLabel="Buat Template" />
    </div>
  );
}
