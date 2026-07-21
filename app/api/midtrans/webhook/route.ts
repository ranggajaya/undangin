import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PACKAGES, type PackageId } from "@/lib/midtrans";

interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: "capture" | "settlement" | "pending" | "deny" | "cancel" | "expire";
  fraud_status?: "accept" | "challenge" | "deny";
}

function isValidSignature(notif: MidtransNotification): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const raw = `${notif.order_id}${notif.status_code}${notif.gross_amount}${serverKey}`;
  const expected = createHash("sha512").update(raw).digest("hex");
  return expected === notif.signature_key;
}

export async function POST(request: Request) {
  const notif = (await request.json()) as MidtransNotification;

  // WAJIB: jangan pernah percaya body request sebelum signature-nya valid.
  // Ini mencegah orang lain memalsukan notifikasi "pembayaran sukses".
  if (!isValidSignature(notif)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const supabase = createAdminClient();

  const { data: transaction } = await supabase
    .from("transactions")
    .select("id, invitation_id, package, status")
    .eq("midtrans_order_id", notif.order_id)
    .single();

  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  const isSuccess =
    (notif.transaction_status === "capture" && notif.fraud_status === "accept") ||
    notif.transaction_status === "settlement";
  const isFailed = ["deny", "cancel", "expire"].includes(notif.transaction_status);

  const newStatus = isSuccess
    ? "settlement"
    : isFailed
      ? notif.transaction_status
      : "pending";

  // Idempotent: kalau notifikasi ini datang dua kali (Midtrans kadang retry),
  // jangan aktivasi ulang / perpanjang masa aktif dua kali.
  if (transaction.status === newStatus) {
    return NextResponse.json({ ok: true });
  }

  await supabase
    .from("transactions")
    .update({ status: newStatus })
    .eq("id", transaction.id);

  if (isSuccess && transaction.invitation_id && transaction.package) {
    const pkg = PACKAGES[transaction.package as PackageId];
    const now = new Date();
    const activeUntil = new Date(now);
    activeUntil.setMonth(activeUntil.getMonth() + pkg.activeMonths);

    await supabase
      .from("invitations")
      .update({
        status: "published",
        package: transaction.package,
        masa_aktif_mulai: now.toISOString(),
        masa_aktif_selesai: activeUntil.toISOString(),
      })
      .eq("id", transaction.invitation_id);
  }

  return NextResponse.json({ ok: true });
}
