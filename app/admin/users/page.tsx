import { createClient } from "@/lib/supabase/server";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";
import { redirect } from "next/navigation";
import { updateUserRole } from "@/lib/actions/admin-users";
import { PageHeader } from "@/components/ui/PageHeader";

const ROLES = ["user", "customer_support", "template_admin", "super_admin"] as const;

export default async function AdminUsersPage() {
  const auth = await getCurrentUserWithRole();
  if (!auth || auth.role !== "super_admin") redirect("/admin");

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Kelola Pengguna"
        description={
          profiles && profiles.length > 0 ? `${profiles.length} akun` : undefined
        }
      />
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-xs font-medium uppercase tracking-wide text-ink/40">
            <tr>
              <th className="px-5 py-3.5">Nama</th>
              <th className="px-5 py-3.5">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {profiles?.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-ink/[0.015]">
                <td className="px-5 py-3.5 font-medium text-ink">
                  {p.full_name ?? (
                    <span className="italic text-ink/40">tanpa nama</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <form
                    action={async (formData) => {
                      "use server";
                      const newRole = formData.get(
                        "role"
                      ) as (typeof ROLES)[number];
                      await updateUserRole(p.id, newRole);
                    }}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="role"
                      defaultValue={p.role}
                      className="rounded-lg border border-ink/15 px-2.5 py-1.5 text-xs focus:border-terracotta focus:outline-none"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg border border-terracotta px-2.5 py-1.5 text-xs font-medium text-terracotta transition-colors hover:bg-terracotta/5"
                    >
                      Simpan
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
