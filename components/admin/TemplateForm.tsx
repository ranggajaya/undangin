"use client";

import { useState } from "react";
import type { TemplateFormInput } from "@/lib/actions/admin-templates";

export function TemplateForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: Partial<TemplateFormInput>;
  onSubmit: (input: TemplateFormInput) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<TemplateFormInput>({
    slug: initialValues?.slug ?? "",
    name: initialValues?.name ?? "",
    kategori: initialValues?.kategori ?? "",
    thumbnailUrl: initialValues?.thumbnailUrl ?? "",
    defaultThemeConfig:
      initialValues?.defaultThemeConfig ??
      JSON.stringify(
        {
          background: "#2B2420",
          surface: "#3D352E",
          text: "#FDF8F4",
          textMuted: "#B4AFA5",
          accent: "#C17767",
          accentSecondary: "#8A9A7E",
          fontHeading: "var(--font-heading)",
          fontBody: "var(--font-body)",
        },
        null,
        2
      ),
    isActive: initialValues?.isActive ?? true,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="max-w-xl space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Gagal menyimpan.");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-ink/60">
            Slug{" "}
            <span className="text-ink/40">(harus cocok dengan folder di templates/)</span>
          </label>
          <input
            className="input"
            value={values.slug}
            onChange={(e) => setValues({ ...values, slug: e.target.value })}
            placeholder="rosea-minimal"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink/60">Nama Tampilan</label>
          <input
            className="input"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Rosea Minimal"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-ink/60">Kategori</label>
        <input
          className="input"
          value={values.kategori}
          onChange={(e) => setValues({ ...values, kategori: e.target.value })}
          placeholder="minimalis"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-ink/60">Thumbnail URL</label>
        <input
          className="input"
          value={values.thumbnailUrl}
          onChange={(e) =>
            setValues({ ...values, thumbnailUrl: e.target.value })
          }
          placeholder="/templates/rosea-minimal/thumbnail.jpg"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-ink/60">
          Default Theme Config (JSON)
        </label>
        <textarea
          className="input min-h-[180px] font-mono text-xs"
          value={values.defaultThemeConfig}
          onChange={(e) =>
            setValues({ ...values, defaultThemeConfig: e.target.value })
          }
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => setValues({ ...values, isActive: e.target.checked })}
        />
        Aktif (tampil di katalog)
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-terracotta px-5 py-2.5 text-sm font-medium text-cream disabled:opacity-50"
      >
        {isSubmitting ? "Menyimpan..." : submitLabel}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(43, 36, 32, 0.15);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: white;
        }
        .input:focus {
          outline: none;
          border-color: #c17767;
          box-shadow: 0 0 0 1px #c17767;
        }
      `}</style>
    </form>
  );
}
