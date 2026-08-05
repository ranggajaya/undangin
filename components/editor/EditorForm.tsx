"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Heart,
  CalendarHeart,
  BookHeart,
  Gift,
  Images,
  ArrowLeft,
  X,
  Plus,
} from "lucide-react";
import {
  saveDraftInvitation,
  uploadInvitationAsset,
} from "@/lib/actions/invitations";
import type { DraftInvitationData } from "@/lib/invitation-data";
import { Badge } from "@/components/ui/Badge";

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
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink"
          >
            <ArrowLeft size={15} /> Dashboard
          </a>
          <SaveStatusBadge status={saveStatus} />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-6 font-heading text-2xl text-ink">Isi Data Undangan</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            <Card icon={<Heart size={16} />} title="Nama Pasangan">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nama pria" error={errors.groomName?.message}>
                  <input
                    {...register("groomName")}
                    className="field"
                    placeholder="Bagas"
                  />
                </Field>
                <Field label="Nama wanita" error={errors.brideName?.message}>
                  <input
                    {...register("brideName")}
                    className="field"
                    placeholder="Ayu"
                  />
                </Field>
              </div>
            </Card>

            <Card icon={<CalendarHeart size={16} />} title="Akad Nikah">
              <EventFields
                register={register}
                control={control}
                prefix="akad"
                errors={errors.akad}
              />
            </Card>

            <Card icon={<CalendarHeart size={16} />} title="Resepsi">
              <EventFields
                register={register}
                control={control}
                prefix="resepsi"
                errors={errors.resepsi}
              />
            </Card>

            <Card icon={<BookHeart size={16} />} title="Cerita Pasangan">
              <textarea
                {...register("loveStory")}
                className="field min-h-[100px]"
                placeholder="Ceritakan bagaimana kalian bertemu..."
              />
            </Card>

            <Card icon={<Gift size={16} />} title="Info Hadiah">
              <textarea
                {...register("giftInfo")}
                className="field min-h-[70px]"
                placeholder="Nomor rekening / alamat kado (opsional)"
              />
            </Card>

            <Card icon={<Images size={16} />} title="Galeri Foto">
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
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-terracotta/50 text-terracotta transition-colors hover:border-terracotta hover:bg-terracotta/5">
                  {isUploading ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Plus size={18} />
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
              <p className="mt-2 text-xs text-ink/40">
                Bisa pilih beberapa foto sekaligus.
              </p>
            </Card>
          </div>

          <aside>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
              Preview
            </p>
            <div className="sticky top-6 space-y-3">
              <div className="rounded-2xl bg-ink p-5 text-center text-cream shadow-sm">
                <p className="font-heading text-lg">
                  {watchedValues.groomName || "Nama Pria"} &amp;{" "}
                  {watchedValues.brideName || "Nama Wanita"}
                </p>
                <p className="mt-1 text-xs text-cream/50">
                  {watchedValues.akad?.date || "Tanggal akad belum diisi"}
                </p>
              </div>
              <a
                href={`/u/${slug}`}
                target="_blank"
                className="block rounded-lg border border-ink/10 bg-white py-2 text-center text-xs font-medium text-terracotta hover:border-terracotta/30"
              >
                Lihat preview penuh →
              </a>
              {children}
            </div>
          </aside>
        </div>
      </main>

      <style jsx global>{`
        .field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(43, 36, 32, 0.13);
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          background: white;
        }
        .field:focus {
          outline: none;
          border-color: #c17767;
          box-shadow: 0 0 0 1px #c17767;
        }
      `}</style>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="text-terracotta">{icon}</span>
        {title}
      </h2>
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
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink/45">
        {label}
      </label>
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
        <input type="date" {...register(`${prefix}.date`)} className="field" />
      </Field>
      <TimeRangeField
        control={control}
        prefix={prefix}
        error={errors?.time?.message}
      />
      <Field label="Lokasi" error={errors?.location?.message}>
        <input
          {...register(`${prefix}.location`)}
          className="field col-span-2"
          placeholder="Nama gedung / alamat"
        />
      </Field>
    </div>
  );
}

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
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink/45">
              Waktu
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={start}
                onChange={(e) =>
                  field.onChange(formatTimeRange(e.target.value, end))
                }
                className="field"
              />
              <span className="text-xs text-ink/30">–</span>
              <input
                type="time"
                value={end}
                onChange={(e) =>
                  field.onChange(formatTimeRange(start, e.target.value))
                }
                className="field"
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
    idle: { text: "Draft tersimpan", tone: "sage" as const },
    saving: { text: "Menyimpan...", tone: "terracotta" as const },
    saved: { text: "Draft tersimpan", tone: "sage" as const },
    error: { text: "Gagal menyimpan", tone: "red" as const },
  }[status];

  return <Badge tone={config.tone}>{config.text}</Badge>;
}
