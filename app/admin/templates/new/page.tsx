"use client";

import { TemplateForm } from "@/components/admin/TemplateForm";
import { createTemplate } from "@/lib/actions/admin-templates";
import { PageHeader } from "@/components/ui/PageHeader";

export default function NewTemplatePage() {
  return (
    <div>
      <PageHeader title="Template Baru" description="Tambahkan desain undangan baru ke katalog." />
      <TemplateForm onSubmit={createTemplate} submitLabel="Buat Template" />
    </div>
  );
}
