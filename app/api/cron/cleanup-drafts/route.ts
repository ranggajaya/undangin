import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const INACTIVE_DAYS_THRESHOLD = 60;

// Dipanggil Vercel Cron (lihat vercel.json) sekali sehari. Pakai admin
// client karena ini bukan aksi 1 user tertentu — perlu bisa hapus draft
// milik siapa saja yang memenuhi kriteria.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - INACTIVE_DAYS_THRESHOLD);

  const { data: staleDrafts, error: fetchError } = await supabase
    .from("invitations")
    .select("id, owner_id")
    .eq("status", "draft")
    .lt("updated_at", cutoff.toISOString());

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!staleDrafts || staleDrafts.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  let deletedCount = 0;
  const errors: string[] = [];

  for (const draft of staleDrafts) {
    try {
      // Hapus asset di Storage dulu (foto/audio) — kalau row invitation
      // dihapus lebih dulu, path folder assetnya jadi tidak bisa dilacak
      // lagi lewat invitation_id.
      const { data: files } = await supabase.storage
        .from("invitation-assets")
        .list(`${draft.owner_id}/${draft.id}`);

      if (files && files.length > 0) {
        const paths = files.map(
          (f) => `${draft.owner_id}/${draft.id}/${f.name}`
        );
        await supabase.storage.from("invitation-assets").remove(paths);
      }

      const { error: deleteError } = await supabase
        .from("invitations")
        .delete()
        .eq("id", draft.id);

      if (deleteError) throw new Error(deleteError.message);
      deletedCount++;
    } catch (err) {
      errors.push(
        `${draft.id}: ${err instanceof Error ? err.message : "unknown error"}`
      );
    }
  }

  return NextResponse.json({ deleted: deletedCount, errors });
}
