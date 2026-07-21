import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditTemplateForm } from "./EditTemplateForm";

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
      <h1 className="mb-6 font-heading text-2xl text-ink">
        Edit Template: {template.name}
      </h1>
      <EditTemplateForm template={template} />
    </div>
  );
}
