import { LayoutTemplate, Headset, Users, ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";
import { Badge } from "@/components/ui/Badge";

const ADMIN_ROLES = ["super_admin", "template_admin", "customer_support"];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  template_admin: "Template Admin",
  customer_support: "Customer Support",
};

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
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-ink/10 bg-white">
        <div className="border-b border-ink/10 px-5 py-5">
          <a href="/" className="font-heading text-lg text-ink">
            undangin
          </a>
          <div className="mt-2">
            <Badge tone="terracotta">{ROLE_LABELS[role] ?? role}</Badge>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {canManageTemplates && (
            <NavLink href="/admin/templates" icon={<LayoutTemplate size={16} />}>
              Template
            </NavLink>
          )}
          {canDoSupport && (
            <NavLink href="/admin/support" icon={<Headset size={16} />}>
              Support
            </NavLink>
          )}
          {canManageUsers && (
            <NavLink href="/admin/users" icon={<Users size={16} />}>
              Pengguna
            </NavLink>
          )}
        </nav>

        <div className="border-t border-ink/10 p-3">
          <NavLink href="/dashboard" icon={<ArrowLeft size={16} />}>
            Kembali ke Dashboard
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/65 transition-colors hover:bg-ink/[0.04] hover:text-ink"
    >
      {icon}
      {children}
    </a>
  );
}
