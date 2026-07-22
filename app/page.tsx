import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta">
          <span className="font-heading text-lg text-cream">U</span>
        </div>
        <h1 className="font-heading text-3xl">undangin</h1>
        <p className="mb-7 mt-1 text-xs tracking-widest text-sage">
          undangan digital pernikahan
        </p>
        <p className="mb-7 max-w-sm text-sm text-ink/70">
          Pilih desain favoritmu, isi cerita kalian berdua, dan bagikan
          undangan yang berkesan ke semua orang tersayang.
        </p>
        <div className="flex gap-3">
          {/* TODO: ganti ke /katalog begitu halaman katalog template dibuat */}
          <a
            href="/register"
            className="rounded-lg bg-terracotta px-6 py-2.5 text-sm font-medium text-cream"
          >
            Buat undangan
          </a>
          <a
            href="/dashboard"
            className="rounded-lg border border-ink px-6 py-2.5 text-sm font-medium text-ink"
          >
            Lihat desain
          </a>
        </div>
      </main>
    </>
  );
}
