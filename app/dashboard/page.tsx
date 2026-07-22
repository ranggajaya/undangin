import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createDraftInvitation } from "@/lib/actions/invitations";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";
import { signOut } from "@/lib/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const auth = await getCurrentUserWithRole();
  const isAdmin =
    auth && ["super_admin", "template_admin", "customer_support"].includes(auth.role);

  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, slug, status, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Undangan Saya</h1>
        <div className="flex gap-2">
          {isAdmin && (
            <a
              href="/admin"
              className="rounded-lg border border-ink px-4 py-2 text-sm font-medium text-ink"
            >
              Admin Panel
            </a>
          )}
          <form action={createDraftInvitation}>
            <button
              type="submit"
              className="rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-cream"
            >
              + Buat Undangan Baru
            </button>
          </form>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-ink/20 px-4 py-2 text-sm text-ink/50"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>

      {!invitations || invitations.length === 0 ? (
        <p className="text-sm text-ink/60">
          Belum ada undangan. Klik &quot;Buat Undangan Baru&quot; untuk mulai.
        </p>
      ) : (
        <ul className="space-y-3">
          {invitations.map((inv) => (
            <li key={inv.id}>
              <a
                href={`/editor/${inv.id}`}
                className="flex items-center justify-between rounded-xl border border-ink/10 bg-white px-4 py-3 hover:border-terracotta"
              >
                <span className="text-sm text-ink">{inv.slug}</span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor:
                      inv.status === "published" ? "#8A9A7E20" : "#D8D3C860",
                    color: inv.status === "published" ? "#8A9A7E" : "#5A5049",
                  }}
                >
                  {inv.status === "published" ? "Sudah publish" : "Draft"}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
