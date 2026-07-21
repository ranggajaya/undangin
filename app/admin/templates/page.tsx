import { createClient } from "@/lib/supabase/server";
import { toggleTemplateActive } from "@/lib/actions/admin-templates";

export default async function AdminTemplatesPage() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from("templates")
    .select("id, slug, name, kategori, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Kelola Template</h1>
        <a
          href="/admin/templates/new"
          className="rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-cream"
        >
          + Template Baru
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {templates?.map((t) => (
              <tr key={t.id} className="border-t border-ink/5">
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3 text-ink/60">{t.slug}</td>
                <td className="px-4 py-3 text-ink/60">{t.kategori}</td>
                <td className="px-4 py-3">
                  <form
                    action={async () => {
                      "use server";
                      await toggleTemplateActive(t.id, !t.is_active);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: t.is_active ? "#8A9A7E20" : "#D8D3C860",
                        color: t.is_active ? "#8A9A7E" : "#5A5049",
                      }}
                    >
                      {t.is_active ? "Aktif" : "Nonaktif"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/templates/${t.id}`}
                    className="text-xs text-terracotta underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
            {(!templates || templates.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/40">
                  Belum ada template.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
