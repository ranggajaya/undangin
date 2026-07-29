import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { createDraftInvitationWithTemplate } from "@/lib/actions/invitations";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/PageHeader";

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
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-sage">
            Katalog Desain
          </p>
          <h1 className="mb-2 font-heading text-3xl text-ink">
            Pilih desain undanganmu
          </h1>
          <p className="text-sm text-ink/55">
            {templates?.length ?? 0} desain tersedia
            {categories.length > 0 && ` di ${categories.length} kategori`} —
            semua bisa dicoba gratis sebelum publish
          </p>
        </div>

        {(!templates || templates.length === 0) && (
          <EmptyState
            icon={<Sparkles size={20} strokeWidth={1.5} />}
            title="Belum ada desain tersedia"
            description="Coba lagi nanti — desain baru akan segera ditambahkan."
          />
        )}

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {templates?.map((t) => (
            <div
              key={t.id}
              className="group overflow-hidden rounded-2xl border border-ink/10 bg-white transition-shadow hover:shadow-lg hover:shadow-ink/5"
            >
              {/* Thumbnail asli belum di-upload — placeholder bergradasi
                  warna brand dulu. Ganti ke <img> begitu asetnya ada. */}
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-terracotta/15 via-cream to-sage/10">
                <span className="font-heading text-base text-ink/40">
                  {t.name}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-[10px] font-medium capitalize text-ink/60 backdrop-blur">
                  {t.kategori}
                </span>
              </div>
              <div className="p-4">
                <p className="mb-3 text-sm font-medium text-ink">{t.name}</p>
                <form
                  action={async () => {
                    "use server";
                    await createDraftInvitationWithTemplate(t.id);
                  }}
                >
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full justify-center group-hover:bg-terracotta/90"
                  >
                    Pilih desain ini
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
