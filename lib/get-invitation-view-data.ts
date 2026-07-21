import { createClient } from "@/lib/supabase/server";
import type { InvitationData, ThemeConfig } from "@/templates/types";
import type { DraftInvitationData } from "@/lib/invitation-data";

export interface PublicInvitationView {
  invitationId: string;
  templateSlug: string;
  theme: ThemeConfig;
  data: InvitationData;
  showWatermark: boolean;
}

// Dipakai bareng oleh page.tsx dan generateMetadata() supaya query tidak
// dobel — Next.js otomatis dedupe fetch yang sama dalam satu request lewat
// React `cache()`, tapi di sini kita panggil manual dari 2 tempat berbeda
// jadi tetap query 2x. Untuk skala MVP ini belum masalah; optimisasi
// (React cache / unstable_cache) bisa menyusul kalau traffic naik.
export async function getPublicInvitationView(
  slug: string
): Promise<PublicInvitationView | null> {
  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, data, status, template_id, package")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!invitation || !invitation.template_id) return null;

  const { data: template } = await supabase
    .from("templates")
    .select("slug, default_theme_config")
    .eq("id", invitation.template_id)
    .single();

  if (!template?.slug) return null;

  const { data: wishRows } = await supabase
    .from("wishes")
    .select("id, nama_tamu, pesan, created_at")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  const draft = invitation.data as Partial<DraftInvitationData>;

  const invitationData: InvitationData = {
    groomName: draft.groomName ?? "",
    brideName: draft.brideName ?? "",
    coverPhotoUrl: draft.coverPhotoUrl,
    galleryPhotoUrls: draft.galleryPhotoUrls ?? [],
    loveStory: draft.loveStory,
    giftInfo: draft.giftInfo,
    audioUrl: draft.audioUrl,
    events: [draft.akad, draft.resepsi].filter(
      (e): e is NonNullable<typeof e> => Boolean(e?.date)
    ),
    wishes: (wishRows ?? []).map((w) => ({
      id: w.id,
      guestName: w.nama_tamu,
      message: w.pesan,
      createdAt: w.created_at,
    })),
  };

  return {
    invitationId: invitation.id,
    templateSlug: template.slug,
    theme: template.default_theme_config as ThemeConfig,
    data: invitationData,
    // Sesuai keputusan PRD: publish gratis (1x/akun) tetap ada watermark.
    // package null dianggap free juga sebagai fallback aman.
    showWatermark: !invitation.package || invitation.package === "free",
  };
}
