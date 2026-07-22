import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-ink/10 bg-cream/80 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <a href="/" className="font-heading text-lg text-ink">
          undangin
        </a>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <a href="/dashboard" className="text-ink/70 hover:text-terracotta">
                Dashboard
              </a>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-ink/50 hover:text-terracotta"
                >
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <a href="/login" className="text-ink/70 hover:text-terracotta">
                Masuk
              </a>
              <a
                href="/register"
                className="rounded-lg bg-terracotta px-4 py-1.5 text-cream"
              >
                Daftar
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
