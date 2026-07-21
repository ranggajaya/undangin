import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTemplate } from "@/templates/registry";
import { getPublicInvitationView } from "@/lib/get-invitation-view-data";
import { submitWish } from "@/lib/actions/wishes";

// ISR: halaman ini di-generate ulang paling sering tiap 5 menit, bukan tiap
// request. Cukup untuk konten yang jarang berubah (data acara), dan ucapan
// baru tetap muncul instan buat visitor yang sedang online lewat Realtime
// (issue #8) — jadi 5 menit di sini tidak masalah.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const view = await getPublicInvitationView(slug);

  if (!view) {
    return { title: "Undangan tidak ditemukan — Undangin" };
  }

  const { groomName, brideName, coverPhotoUrl } = view.data;
  const title = `${groomName} & ${brideName}`;
  const description = `Kamu diundang ke acara pernikahan ${groomName} & ${brideName}. Buka undangannya di sini.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: coverPhotoUrl ? [{ url: coverPhotoUrl }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverPhotoUrl ? [coverPhotoUrl] : undefined,
    },
  };
}

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const view = await getPublicInvitationView(slug);

  if (!view) notFound();

  const template = getTemplate(view.templateSlug);
  if (!template) notFound();

  const TemplateComponent = template.component;

  // Fallback ke theme default di kode kalau kolom default_theme_config di
  // DB kosong (misal row template lama sebelum migration slug/theme dibuat).
  const theme =
    view.theme && Object.keys(view.theme).length > 0
      ? view.theme
      : template.meta.defaultTheme;

  return (
    <TemplateComponent
      invitationId={view.invitationId}
      data={view.data}
      theme={theme}
      showWatermark={view.showWatermark}
      onSubmitWish={async (guestName: string, message: string) => {
        "use server";
        await submitWish(slug, guestName, message);
      }}
    />
  );
}
