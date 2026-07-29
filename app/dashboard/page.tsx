import { Plus, Shield, LogOut, FileText, Globe, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createDraftInvitation } from "@/lib/actions/invitations";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";
import { signOut } from "@/lib/actions/auth";
import { Button, LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader, EmptyState } from "@/components/ui/PageHeader";

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
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <a href="/" className="font-heading text-lg text-ink">
            undangin
          </a>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <LinkButton href="/admin" variant="ghost" size="sm" icon={<Shield size={14} />}>
                Admin Panel
              </LinkButton>
            )}
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm" icon={<LogOut size={14} />}>
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <PageHeader
          title="Undangan Saya"
          description={
            invitations && invitations.length > 0
              ? `${invitations.length} undangan dibuat`
              : undefined
          }
          actions={
            <form action={createDraftInvitation}>
              <Button type="submit" icon={<Plus size={16} />}>
                Buat Undangan Baru
              </Button>
            </form>
          }
        />

        {!invitations || invitations.length === 0 ? (
          <EmptyState
            icon={<FileText size={20} strokeWidth={1.5} />}
            title="Belum ada undangan"
            description="Mulai buat undangan pertamamu — pilih desain dan isi datanya, publish saat sudah siap."
            action={
              <LinkButton href="/katalog" icon={<Plus size={16} />}>
                Buat Undangan Baru
              </LinkButton>
            }
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {invitations.map((inv) => (
              <li key={inv.id}>
                <a
                  href={`/editor/${inv.id}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-5 transition-all hover:border-terracotta/40 hover:shadow-md hover:shadow-ink/5"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          inv.status === "published" ? "#8A9A7E15" : "#2B242010",
                      }}
                    >
                      {inv.status === "published" ? (
                        <Globe size={16} style={{ color: "#8A9A7E" }} />
                      ) : (
                        <FileText size={16} className="text-ink/40" />
                      )}
                    </div>
                    <Badge tone={inv.status === "published" ? "sage" : "neutral"}>
                      {inv.status === "published" ? "Sudah publish" : "Draft"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink group-hover:text-terracotta">
                      {inv.slug}
                    </p>
                    <p className="mt-0.5 text-xs text-ink/40">
                      {new Date(inv.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {inv.status === "published" && (
                    <span className="flex items-center gap-1 text-xs text-terracotta">
                      Lihat undangan <ExternalLink size={11} />
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
