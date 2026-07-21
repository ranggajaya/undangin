import { createClient } from "@/lib/supabase/server";
import { getCurrentUserWithRole } from "@/lib/get-current-user-role";
import { redirect } from "next/navigation";
import { updateUserRole } from "@/lib/actions/admin-users";

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
      <h1 className="mb-6 font-heading text-2xl text-ink">Kelola Pengguna</h1>
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((p) => (
              <tr key={p.id} className="border-t border-ink/5">
                <td className="px-4 py-3">{p.full_name ?? "(tanpa nama)"}</td>
                <td className="px-4 py-3">
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
                      className="rounded-lg border border-ink/15 px-2 py-1 text-xs"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg border border-terracotta px-2 py-1 text-xs text-terracotta"
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
