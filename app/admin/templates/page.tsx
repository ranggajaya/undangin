import { Plus, Pencil, LayoutTemplate } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { toggleTemplateActive } from "@/lib/actions/admin-templates";
import { PageHeader, EmptyState } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function AdminTemplatesPage() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from("templates")
    .select("id, slug, name, kategori, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Kelola Template"
        description={
          templates && templates.length > 0
            ? `${templates.length} desain terdaftar`
            : undefined
        }
        actions={
          <LinkButton href="/admin/templates/new" icon={<Plus size={16} />}>
            Template Baru
          </LinkButton>
        }
      />

      {!templates || templates.length === 0 ? (
        <EmptyState
          icon={<LayoutTemplate size={20} strokeWidth={1.5} />}
          title="Belum ada template"
          description="Tambahkan desain pertama supaya muncul di katalog."
          action={
            <LinkButton href="/admin/templates/new" icon={<Plus size={16} />}>
              Template Baru
            </LinkButton>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-ink/10 text-left text-xs font-medium uppercase tracking-wide text-ink/40">
              <tr>
                <th className="px-5 py-3.5">Nama</th>
                <th className="px-5 py-3.5">Slug</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {templates.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-ink/[0.015]">
                  <td className="px-5 py-3.5 font-medium text-ink">{t.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-ink/50">
                    {t.slug}
                  </td>
                  <td className="px-5 py-3.5 capitalize text-ink/60">
                    {t.kategori}
                  </td>
                  <td className="px-5 py-3.5">
                    <form
                      action={async () => {
                        "use server";
                        await toggleTemplateActive(t.id, !t.is_active);
                      }}
                    >
                      <button type="submit">
                        <Badge tone={t.is_active ? "sage" : "neutral"}>
                          {t.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={`/admin/templates/${t.id}`}
                      className="inline-flex items-center gap-1 text-xs text-ink/50 hover:text-terracotta"
                    >
                      <Pencil size={12} /> Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
