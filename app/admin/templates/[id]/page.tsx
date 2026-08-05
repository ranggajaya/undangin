import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditTemplateForm } from "./EditTemplateForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: template } = await supabase
    .from("templates")
    .select("id, slug, name, kategori, thumbnail_url, default_theme_config, is_active")
    .eq("id", id)
    .single();

  if (!template) notFound();

  return (
    <div>
      <PageHeader title={`Edit Template: ${template.name}`} />
      <EditTemplateForm template={template} />
    </div>
  );
}
