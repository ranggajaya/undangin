"use client";

import { useState } from "react";
import type { TemplateFormInput } from "@/lib/actions/admin-templates";
import { Button } from "@/components/ui/Button";

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
      className="max-w-xl rounded-2xl border border-ink/10 bg-white p-6"
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
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug" hint="harus cocok dengan folder di templates/">
            <input
              className="field"
              value={values.slug}
              onChange={(e) => setValues({ ...values, slug: e.target.value })}
              placeholder="rosea-minimal"
              required
            />
          </Field>
          <Field label="Nama Tampilan">
            <input
              className="field"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Rosea Minimal"
              required
            />
          </Field>
        </div>

        <Field label="Kategori">
          <input
            className="field"
            value={values.kategori}
            onChange={(e) => setValues({ ...values, kategori: e.target.value })}
            placeholder="minimalis"
            required
          />
        </Field>

        <Field label="Thumbnail URL">
          <input
            className="field"
            value={values.thumbnailUrl}
            onChange={(e) =>
              setValues({ ...values, thumbnailUrl: e.target.value })
            }
            placeholder="/templates/rosea-minimal/thumbnail.jpg"
          />
        </Field>

        <Field label="Default Theme Config (JSON)">
          <textarea
            className="field min-h-[180px] font-mono text-xs leading-relaxed"
            value={values.defaultThemeConfig}
            onChange={(e) =>
              setValues({ ...values, defaultThemeConfig: e.target.value })
            }
          />
        </Field>

        <label className="flex items-center gap-2.5 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) =>
              setValues({ ...values, isActive: e.target.checked })
            }
            className="h-4 w-4 rounded border-ink/25 text-terracotta focus:ring-terracotta"
          />
          Aktif (tampil di katalog)
        </label>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </Button>
      </div>

      <style jsx global>{`
        .field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(43, 36, 32, 0.15);
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          background: white;
        }
        .field:focus {
          outline: none;
          border-color: #c17767;
          box-shadow: 0 0 0 1px #c17767;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/60">
        {label}
        {hint && (
          <span className="ml-1.5 font-normal normal-case tracking-normal text-ink/35">
            ({hint})
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
