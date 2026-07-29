import { LayoutTemplate, Share2, Wallet, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from("templates")
    .select("id, slug, name, kategori")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="px-6 pb-16 pt-16 text-center sm:pt-24">
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta">
          <span className="font-heading text-lg text-cream">U</span>
        </div>
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">undangin</h1>
        <p className="mb-7 mt-1 text-xs tracking-widest text-sage">
          UNDANGAN DIGITAL PERNIKAHAN
        </p>
        <p className="mx-auto mb-8 max-w-md text-sm text-ink/70 sm:text-base">
          Pilih desain favoritmu, isi cerita kalian berdua, dan bagikan
          undangan yang berkesan ke semua orang tersayang — tanpa ribet,
          tanpa perlu jasa desain custom.
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="/katalog"
            className="rounded-lg bg-terracotta px-6 py-2.5 text-sm font-medium text-cream"
          >
            Buat undangan
          </a>
          <a
            href="/katalog"
            className="rounded-lg border border-ink px-6 py-2.5 text-sm font-medium text-ink"
          >
            Lihat desain
          </a>
        </div>
      </section>

      {/* Fitur */}
      <section className="border-t border-ink/10 bg-white px-6 py-16">
        <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
          <Feature
            icon={<LayoutTemplate size={22} strokeWidth={1.5} />}
            title="Banyak Desain"
            description="Pilih dari berbagai gaya — minimalis, elegan, rustic — sesuai selera kalian."
          />
          <Feature
            icon={<Share2 size={22} strokeWidth={1.5} />}
            title="Mudah Dibagikan"
            description="Satu link untuk semua tamu, siap dibagikan lewat WhatsApp dalam hitungan menit."
          />
          <Feature
            icon={<Wallet size={22} strokeWidth={1.5} />}
            title="Hemat Biaya"
            description="Publish pertama gratis. Paket berbayar baru diperlukan kalau undangan sudah siap disebar."
          />
        </div>
      </section>

      {/* Preview katalog */}
      {templates && templates.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl text-ink">
                Beberapa desain pilihan
              </h2>
              <a
                href="/katalog"
                className="flex items-center gap-1 text-xs text-terracotta"
              >
                Lihat semua <ArrowRight size={14} />
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {templates.map((t) => (
                <a
                  key={t.id}
                  href="/katalog"
                  className="overflow-hidden rounded-xl border border-ink/10 bg-white"
                >
                  <div className="flex h-28 items-center justify-center bg-ink/5">
                    <span className="font-heading text-xs text-ink/30">
                      {t.name}
                    </span>
                  </div>
                  <p className="p-2 text-center text-xs text-ink/60 capitalize">
                    {t.kategori}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-ink/10 px-6 py-8 text-center">
        <p className="text-xs text-ink/40">
          undangin, oleh{" "}
          <span className="font-medium text-ink/60">cooreidev</span>
        </p>
      </footer>
    </>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center sm:text-left">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta sm:mx-0">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-ink">{title}</h3>
      <p className="text-xs leading-relaxed text-ink/60">{description}</p>
    </div>
  );
}
