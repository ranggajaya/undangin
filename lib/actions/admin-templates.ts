"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// PENTING: jangan pernah cuma andalkan role-gate di layout.tsx untuk
// keamanan — itu cuma UX (sembunyikan menu). Server action bisa dipanggil
// langsung tanpa lewat UI, jadi role WAJIB dicek ulang di sini juga.
// RLS di database jadi lapisan terakhir kalau ini bocor.
async function assertTemplateAdmin() {
  const auth = await getCurrentUserWithRole();
  if (!auth || !["super_admin", "template_admin"].includes(auth.role)) {
    throw new Error("Tidak punya akses untuk mengelola template.");
  }
  return auth;
}

export interface TemplateFormInput {
  slug: string;
  name: string;
  kategori: string;
  thumbnailUrl: string;
  defaultThemeConfig: string; // JSON string dari textarea
  isActive: boolean;
}

function parseThemeConfig(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Format JSON themeConfig tidak valid.");
  }
}

export async function createTemplate(input: TemplateFormInput) {
  await assertTemplateAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("templates").insert({
    slug: input.slug,
    name: input.name,
    kategori: input.kategori,
    thumbnail_url: input.thumbnailUrl,
    default_theme_config: parseThemeConfig(input.defaultThemeConfig),
    is_active: input.isActive,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/templates");
  redirect("/admin/templates");
}

export async function updateTemplate(id: string, input: TemplateFormInput) {
  await assertTemplateAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("templates")
    .update({
      slug: input.slug,
      name: input.name,
      kategori: input.kategori,
      thumbnail_url: input.thumbnailUrl,
      default_theme_config: parseThemeConfig(input.defaultThemeConfig),
      is_active: input.isActive,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/templates");
  redirect("/admin/templates");
}

export async function toggleTemplateActive(id: string, isActive: boolean) {
  await assertTemplateAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("templates")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/templates");
}
