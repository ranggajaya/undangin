"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitWish(
  slug: string,
  guestName: string,
  message: string
) {
  if (!guestName.trim() || !message.trim()) {
    throw new Error("Nama dan ucapan wajib diisi.");
  }

  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!invitation) throw new Error("Undangan tidak ditemukan.");

  const { error } = await supabase.from("wishes").insert({
    invitation_id: invitation.id,
    nama_tamu: guestName.trim(),
    pesan: message.trim(),
  });

  if (error) throw new Error(error.message);

  // Revalidate supaya visitor lain yang buka halaman ini (non-realtime,
  // misal search engine crawler) tetap lihat ucapan terbaru. Update
  // realtime untuk visitor yang SEDANG membuka halaman menyusul di issue #8.
  revalidatePath(`/u/${slug}`);
}
