import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { createDraftInvitationWithTemplate } from "@/lib/actions/invitations";

export default async function KatalogPage() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from("templates")
    .select("id, slug, name, kategori, thumbnail_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const categories = Array.from(
    new Set((templates ?? []).map((t) => t.kategori))
  );

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-1 font-heading text-2xl text-ink">
          Pilih desain undanganmu
        </h1>
        <p className="mb-8 text-sm text-ink/60">
          {templates?.length ?? 0} desain
          {categories.length > 0 && ` di ${categories.length} kategori`}
        </p>

        {(!templates || templates.length === 0) && (
          <p className="text-sm text-ink/40">
            Belum ada desain tersedia. Coba lagi nanti.
          </p>
        )}

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {templates?.map((t) => (
            <div
              key={t.id}
              className="overflow-hidden rounded-xl border border-ink/10 bg-white"
            >
              {/* Thumbnail asli belum di-upload — placeholder warna dulu.
                  Ganti ke <img src={t.thumbnail_url}> begitu asetnya ada. */}
              <div className="flex h-40 items-center justify-center bg-ink/5">
                <span className="font-heading text-sm text-ink/30">
                  {t.name}
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-ink">{t.name}</p>
                <p className="mb-3 text-xs capitalize text-ink/50">
                  {t.kategori}
                </p>
                <form
                  action={async () => {
                    "use server";
                    await createDraftInvitationWithTemplate(t.id);
                  }}
                >
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-terracotta py-2 text-xs font-medium text-cream"
                  >
                    Pilih desain ini
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
