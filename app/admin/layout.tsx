import { redirect } from "next/navigation";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";

const ADMIN_ROLES = ["super_admin", "template_admin", "customer_support"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentUserWithRole();

  if (!auth) redirect("/login");
  if (!ADMIN_ROLES.includes(auth.role)) redirect("/dashboard");

  const { role } = auth;
  const canManageTemplates = role === "super_admin" || role === "template_admin";
  const canDoSupport = role === "super_admin" || role === "customer_support";
  const canManageUsers = role === "super_admin";

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="font-heading text-lg text-ink">Undangin Admin</p>
            <p className="text-xs text-ink/50">
              Login sebagai <span className="font-medium">{role}</span>
            </p>
          </div>
          <nav className="flex gap-4 text-sm">
            {canManageTemplates && (
              <a href="/admin/templates" className="text-ink/70 hover:text-terracotta">
                Template
              </a>
            )}
            {canDoSupport && (
              <a href="/admin/support" className="text-ink/70 hover:text-terracotta">
                Support
              </a>
            )}
            {canManageUsers && (
              <a href="/admin/users" className="text-ink/70 hover:text-terracotta">
                Pengguna
              </a>
            )}
            <a href="/dashboard" className="text-ink/40 hover:text-terracotta">
              ← Keluar admin
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
