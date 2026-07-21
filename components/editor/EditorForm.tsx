"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  saveDraftInvitation,
  uploadInvitationAsset,
} from "@/lib/actions/invitations";
import type { DraftInvitationData } from "@/lib/invitation-data";

const eventSchema = z.object({
  label: z.string(),
  date: z.string().min(1, "Tanggal wajib diisi"),
  time: z.string().min(1, "Waktu wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
});

const editorSchema = z.object({
  groomName: z.string().min(1, "Nama wajib diisi"),
  brideName: z.string().min(1, "Nama wajib diisi"),
  loveStory: z.string().optional(),
  giftInfo: z.string().optional(),
  akad: eventSchema,
  resepsi: eventSchema,
});

type EditorFormValues = z.infer<typeof editorSchema>;

const AUTOSAVE_DELAY_MS = 1200;

export function EditorForm({
  invitationId,
  slug,
  initialData,
  children,
}: {
  invitationId: string;
  slug: string;
  initialData: DraftInvitationData;
  children?: React.ReactNode;
}) {
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    initialData.galleryPhotoUrls
  );
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<EditorFormValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      groomName: initialData.groomName,
      brideName: initialData.brideName,
      loveStory: initialData.loveStory ?? "",
      giftInfo: initialData.giftInfo ?? "",
      akad: initialData.akad,
      resepsi: initialData.resepsi,
    },
  });

  const watchedValues = watch();

  // Auto-save: setiap perubahan di-debounce, baru dikirim ke server action.
  // galleryUrls tidak lewat react-hook-form karena diupdate lewat upload,
  // jadi sengaja dimasukkan sebagai dependency terpisah di bawah.
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const payload: DraftInvitationData = {
          ...watchedValues,
          galleryPhotoUrls: galleryUrls,
          coverPhotoUrl: initialData.coverPhotoUrl,
          audioUrl: initialData.audioUrl,
        };
        await saveDraftInvitation(invitationId, payload);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues), galleryUrls]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Upload berurutan (bukan Promise.all) supaya tidak membanjiri
      // Supabase Storage kalau user pilih banyak foto sekaligus.
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const url = await uploadInvitationAsset(invitationId, formData);
        uploadedUrls.push(url);
      }
      setGalleryUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (url: string) => {
    setGalleryUrls((prev) => prev.filter((u) => u !== url));
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Isi Data Undangan</h1>
        <SaveStatusBadge status={saveStatus} />
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_240px]">
        <div className="space-y-6">
          <Section title="Nama Pasangan">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nama pria" error={errors.groomName?.message}>
                <input
                  {...register("groomName")}
                  className="input"
                  placeholder="Bagas"
                />
              </Field>
              <Field label="Nama wanita" error={errors.brideName?.message}>
                <input
                  {...register("brideName")}
                  className="input"
                  placeholder="Ayu"
                />
              </Field>
            </div>
          </Section>

          <Section title="Akad Nikah">
            <EventFields
              register={register}
              control={control}
              prefix="akad"
              errors={errors.akad}
            />
          </Section>

          <Section title="Resepsi">
            <EventFields
              register={register}
              control={control}
              prefix="resepsi"
              errors={errors.resepsi}
            />
          </Section>

          <Section title="Cerita Pasangan">
            <textarea
              {...register("loveStory")}
              className="input min-h-[100px]"
              placeholder="Ceritakan bagaimana kalian bertemu..."
            />
          </Section>

          <Section title="Info Hadiah">
            <textarea
              {...register("giftInfo")}
              className="input min-h-[70px]"
              placeholder="Nomor rekening / alamat kado (opsional)"
            />
          </Section>

          <Section title="Galeri Foto">
            <div className="flex flex-wrap gap-3">
              {galleryUrls.map((url) => (
                <div key={url} className="group relative h-20 w-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Foto galeri"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-cream opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-terracotta text-terracotta">
                {isUploading ? (
                  <span className="text-xs">...</span>
                ) : (
                  <span className="text-xl">+</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            <p className="mt-1.5 text-xs text-ink/40">
              Bisa pilih beberapa foto sekaligus.
            </p>
          </Section>
        </div>

        <aside>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
            Preview
          </p>
          <div className="sticky top-6 rounded-xl bg-ink p-4 text-center text-cream">
            <p className="font-heading text-lg">
              {watchedValues.groomName || "Nama Pria"} &amp;{" "}
              {watchedValues.brideName || "Nama Wanita"}
            </p>
            <p className="mt-1 text-xs text-cream/60">
              {watchedValues.akad?.date || "Tanggal akad belum diisi"}
            </p>
          </div>
          <a
            href={`/u/${slug}`}
            target="_blank"
            className="mt-3 block text-center text-xs text-terracotta underline"
          >
            Lihat preview penuh →
          </a>
          {children && <div className="mt-4">{children}</div>}
        </aside>
      </div>

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
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-ink/60">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function EventFields({
  register,
  control,
  prefix,
  errors,
}: {
  register: ReturnType<typeof useForm<EditorFormValues>>["register"];
  control: Control<EditorFormValues>;
  prefix: "akad" | "resepsi";
  errors?: {
    date?: { message?: string };
    time?: { message?: string };
    location?: { message?: string };
  };
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Tanggal" error={errors?.date?.message}>
        <input type="date" {...register(`${prefix}.date`)} className="input" />
      </Field>
      <TimeRangeField
        control={control}
        prefix={prefix}
        error={errors?.time?.message}
      />
      <Field label="Lokasi" error={errors?.location?.message}>
        <input
          {...register(`${prefix}.location`)}
          className="input col-span-2"
          placeholder="Nama gedung / alamat"
        />
      </Field>
    </div>
  );
}

// Format tersimpan tetap satu string ("08:00 - 10:00 WIB") supaya kompatibel
// dengan yang dibaca komponen template, tapi user pilih lewat 2 time-picker.
function parseTimeRange(value: string): [string, string] {
  const match = value?.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
  return match ? [match[1], match[2]] : ["", ""];
}

function formatTimeRange(start: string, end: string): string {
  if (!start && !end) return "";
  return `${start || "00:00"} - ${end || "00:00"} WIB`;
}

function TimeRangeField({
  control,
  prefix,
  error,
}: {
  control: Control<EditorFormValues>;
  prefix: "akad" | "resepsi";
  error?: string;
}) {
  return (
    <Controller
      control={control}
      name={`${prefix}.time`}
      render={({ field }) => {
        const [start, end] = parseTimeRange(field.value);
        return (
          <div>
            <label className="mb-1 block text-xs text-ink/60">Waktu</label>
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={start}
                onChange={(e) =>
                  field.onChange(formatTimeRange(e.target.value, end))
                }
                className="input"
              />
              <span className="text-xs text-ink/40">–</span>
              <input
                type="time"
                value={end}
                onChange={(e) =>
                  field.onChange(formatTimeRange(start, e.target.value))
                }
                className="input"
              />
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        );
      }}
    />
  );
}

function SaveStatusBadge({
  status,
}: {
  status: "idle" | "saving" | "saved" | "error";
}) {
  const config = {
    idle: { text: "Draft tersimpan", color: "#8A9A7E" },
    saving: { text: "Menyimpan...", color: "#B8935F" },
    saved: { text: "Draft tersimpan", color: "#8A9A7E" },
    error: { text: "Gagal menyimpan", color: "#C1524A" },
  }[status];

  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: `${config.color}20`, color: config.color }}
    >
      {config.text}
    </span>
  );
}
