"use server";

import { createClient } from "@/lib/supabase/server";
import { createSnapClient, PACKAGES, type PackageId } from "@/lib/midtrans";
import { randomUUID } from "crypto";

type InitiatePublishResult =
  | { kind: "free_published"; slug: string }
  | { kind: "payment_required"; snapToken: string };

export async function initiatePublish(
  invitationId: string,
  packageId?: PackageId
): Promise<InitiatePublishResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak valid.");

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, owner_id, slug, status")
    .eq("id", invitationId)
    .single();

  if (!invitation || invitation.owner_id !== user.id) {
    throw new Error("Undangan tidak ditemukan.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_used_free_publish")
    .eq("id", user.id)
    .single();

  // --- Jalur 1: masih ada jatah free publish ---
  if (!profile?.has_used_free_publish) {
    const now = new Date();
    const activeUntil = new Date(now);
    activeUntil.setMonth(activeUntil.getMonth() + 1);

    const { error: updateError } = await supabase
      .from("invitations")
      .update({
        status: "published",
        package: "free",
        masa_aktif_mulai: now.toISOString(),
        masa_aktif_selesai: activeUntil.toISOString(),
      })
      .eq("id", invitationId);

    if (updateError) throw new Error(updateError.message);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ has_used_free_publish: true })
      .eq("id", user.id);

    if (profileError) throw new Error(profileError.message);

    return { kind: "free_published", slug: invitation.slug };
  }

  // --- Jalur 2: jatah gratis sudah habis, wajib pilih paket & bayar ---
  if (!packageId) {
    throw new Error("Paket wajib dipilih untuk publish selanjutnya.");
  }

  const pkg = PACKAGES[packageId];
  const orderId = `undangin-${invitationId.slice(0, 8)}-${randomUUID().slice(0, 8)}`;

  const { error: txError } = await supabase.from("transactions").insert({
    user_id: user.id,
    invitation_id: invitationId,
    jumlah: pkg.price,
    status: "pending",
    midtrans_order_id: orderId,
    package: packageId,
  });

  if (txError) throw new Error(txError.message);

  const snap = createSnapClient();
  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: orderId,
      gross_amount: pkg.price,
    },
    customer_details: {
      email: user.email,
    },
    item_details: [
      {
        id: packageId,
        price: pkg.price,
        quantity: 1,
        name: `Undangin - Paket ${pkg.label}`,
      },
    ],
  });

  return { kind: "payment_required", snapToken: transaction.token };
}
