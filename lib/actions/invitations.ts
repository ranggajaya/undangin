"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { EMPTY_DRAFT_DATA, type DraftInvitationData } from "@/lib/invitation-data";

function generateSlug(groomName: string, brideName: string) {
  const base = `${groomName}-${brideName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : `undangan-${suffix}`;
}

// Dipanggil dari dashboard saat user klik "Buat Undangan Baru".
// Untuk sekarang template di-hardcode ke satu-satunya template yang ada
// (rosea-minimal); begitu katalog template dibuat, ganti jadi parameter.
export async function createDraftInvitation() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: template } = await supabase
    .from("templates")
    .select("id")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      owner_id: user.id,
      template_id: template?.id ?? null,
      slug: generateSlug("undangan", "baru"),
      status: "draft",
      data: EMPTY_DRAFT_DATA as unknown as never,
    })
    .select("id")
    .single();

  if (error || !invitation) {
    throw new Error(error?.message ?? "Gagal membuat draft undangan.");
  }

  redirect(`/editor/${invitation.id}`);
}

// Auto-save: dipanggil dari client tiap kali form berubah (sudah di-debounce
// di sisi client, lihat components/editor/EditorForm.tsx).
export async function saveDraftInvitation(
  invitationId: string,
  data: DraftInvitationData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak valid.");

  // Slug ikut diperbarui mengikuti nama pasangan, tapi hanya kalau draft
  // belum pernah dipublish — supaya link yang sudah dibagikan tidak berubah.
  const { data: current } = await supabase
    .from("invitations")
    .select("status, slug")
    .eq("id", invitationId)
    .eq("owner_id", user.id)
    .single();

  if (!current) throw new Error("Undangan tidak ditemukan.");

  const shouldRegenerateSlug =
    current.status === "draft" && data.groomName && data.brideName;

  const { error } = await supabase
    .from("invitations")
    .update({
      data: data as unknown as never,
      ...(shouldRegenerateSlug
        ? { slug: generateSlug(data.groomName, data.brideName) }
        : {}),
    })
    .eq("id", invitationId)
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/editor/${invitationId}`);
}

export async function uploadInvitationAsset(
  invitationId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak valid.");

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("File tidak ditemukan.");

  const ext = file.name.split(".").pop();
  const path = `${user.id}/${invitationId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("invitation-assets")
    .upload(path, file, { upsert: false });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("invitation-assets").getPublicUrl(path);

  return publicUrl;
}
