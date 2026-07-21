"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";
import { revalidatePath } from "next/cache";

async function assertSupportAccess() {
  const auth = await getCurrentUserWithRole();
  if (!auth || !["super_admin", "customer_support"].includes(auth.role)) {
    throw new Error("Tidak punya akses untuk fitur support.");
  }
  return auth;
}

export async function searchInvitationBySlug(slugQuery: string) {
  await assertSupportAccess();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select("id, slug, status, package, masa_aktif_mulai, masa_aktif_selesai")
    .ilike("slug", `%${slugQuery}%`)
    .limit(10);

  if (error) throw new Error(error.message);
  return data;
}

export async function extendInvitationActivePeriod(
  invitationId: string,
  additionalMonths: number
) {
  await assertSupportAccess();
  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("masa_aktif_selesai")
    .eq("id", invitationId)
    .single();

  if (!invitation) throw new Error("Undangan tidak ditemukan.");

  // Perpanjang dari tanggal expired yang sekarang (atau dari hari ini kalau
  // sudah lewat), bukan dari hari ini selalu — supaya user yang extend
  // sebelum expired tidak "rugi" sisa waktu yang belum terpakai.
  const base = invitation.masa_aktif_selesai
    ? new Date(
        Math.max(new Date(invitation.masa_aktif_selesai).getTime(), Date.now())
      )
    : new Date();

  const newExpiry = new Date(base);
  newExpiry.setMonth(newExpiry.getMonth() + additionalMonths);

  const { error } = await supabase
    .from("invitations")
    .update({ masa_aktif_selesai: newExpiry.toISOString() })
    .eq("id", invitationId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
}
