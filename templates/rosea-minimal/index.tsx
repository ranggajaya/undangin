"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TemplateProps } from "../types";

// Template "rosea minimal" — kategori: minimalis.
// Ini template referensi pertama; template lain mengikuti struktur props
// yang sama tapi bebas beda total secara visual.
export default function RoseaMinimalTemplate({
  invitationId,
  data,
  theme,
  showWatermark,
  onSubmitWish,
}: TemplateProps) {
  const mainEvent = data.events[0];

  return (
    <main
      className="mx-auto min-h-screen max-w-md px-5 py-10 text-center"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <p
        className="mb-2 text-xs tracking-[0.2em]"
        style={{ color: theme.accent, fontFamily: theme.fontBody }}
      >
        THE WEDDING OF
      </p>
      <h1
        className="mb-1 text-3xl"
        style={{ fontFamily: theme.fontHeading }}
      >
        {data.groomName} &amp; {data.brideName}
      </h1>
      {mainEvent && (
        <p
          className="mb-8 text-xs"
          style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
        >
          {new Date(mainEvent.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {data.coverPhotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.coverPhotoUrl}
          alt={`Foto ${data.groomName} & ${data.brideName}`}
          className="mb-8 h-64 w-full rounded-xl object-cover"
        />
      )}

      {data.events.length > 0 && (
        <section className="mb-8 space-y-4 text-left">
          {data.events.map((event) => (
            <div
              key={event.label}
              className="rounded-xl p-4"
              style={{ backgroundColor: theme.surface }}
            >
              <p
                className="mb-1 text-sm font-semibold"
                style={{ color: theme.accent, fontFamily: theme.fontBody }}
              >
                {event.label}
              </p>
              <p className="text-sm" style={{ fontFamily: theme.fontBody }}>
                {new Date(event.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                , {event.time}
              </p>
              <p
                className="text-sm"
                style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
              >
                {event.location}
              </p>
            </div>
          ))}
        </section>
      )}

      {data.loveStory && (
        <section className="mb-8 text-left">
          <h2
            className="mb-2 text-lg"
            style={{ fontFamily: theme.fontHeading }}
          >
            Cerita Kami
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
          >
            {data.loveStory}
          </p>
        </section>
      )}

      {data.galleryPhotoUrls.length > 0 && (
        <section className="mb-8 grid grid-cols-2 gap-2">
          {data.galleryPhotoUrls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt="Galeri foto pasangan"
              className="h-32 w-full rounded-lg object-cover"
            />
          ))}
        </section>
      )}

      {data.giftInfo && (
        <section
          className="mb-8 rounded-xl p-4 text-left"
          style={{ backgroundColor: theme.surface }}
        >
          <h2
            className="mb-2 text-sm font-semibold"
            style={{ color: theme.accentSecondary, fontFamily: theme.fontBody }}
          >
            Kirim Hadiah
          </h2>
          <p
            className="text-sm"
            style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
          >
            {data.giftInfo}
          </p>
        </section>
      )}

      <WallOfWishes
        invitationId={invitationId}
        initialWishes={data.wishes}
        theme={theme}
        onSubmitWish={onSubmitWish}
      />

      {showWatermark && <Watermark />}
    </main>
  );
}

// Sengaja pakai warna brand Undangin (bukan `theme` milik template), karena
// ini identitas produk, bukan bagian dari desain undangan itu sendiri.
function Watermark() {
  return (
    <a
      href="/"
      target="_blank"
      className="mt-6 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs"
      style={{ backgroundColor: "#FDF8F420", color: "#FDF8F4" }}
    >
      Dibuat dengan{" "}
      <span className="font-heading" style={{ color: "#C17767" }}>
        undangin
      </span>
    </a>
  );
}

function WallOfWishes({
  invitationId,
  initialWishes,
  theme,
  onSubmitWish,
}: {
  invitationId: string;
  initialWishes: TemplateProps["data"]["wishes"];
  theme: TemplateProps["theme"];
  onSubmitWish?: TemplateProps["onSubmitWish"];
}) {
  const [wishes, setWishes] = useState(initialWishes);

  useEffect(() => {
    const supabase = createClient();

    // Filter di level database (bukan filter di client) supaya browser
    // tidak menerima event dari undangan orang lain sama sekali.
    const channel = supabase
      .channel(`wishes-${invitationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wishes",
          filter: `invitation_id=eq.${invitationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            nama_tamu: string;
            pesan: string;
            created_at: string;
          };

          setWishes((prev) => {
            // Hindari duplikat kalau event yang sama entah kenapa masuk 2x
            // (Supabase Realtime kadang retry saat koneksi sempat putus).
            if (prev.some((w) => w.id === row.id)) return prev;
            return [
              {
                id: row.id,
                guestName: row.nama_tamu,
                message: row.pesan,
                createdAt: row.created_at,
              },
              ...prev,
            ];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId]);

  return (
    <section className="border-t pt-6 text-left" style={{ borderColor: theme.textMuted + "40" }}>
      <h2
        className="mb-3 text-sm font-semibold"
        style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
      >
        Ucapan &amp; Doa ({wishes.length})
      </h2>
      <div className="mb-4 max-h-72 space-y-2 overflow-y-auto">
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="rounded-lg p-3"
            style={{ backgroundColor: theme.surface }}
          >
            <p
              className="mb-0.5 text-xs font-semibold"
              style={{ fontFamily: theme.fontBody }}
            >
              {wish.guestName}
            </p>
            <p
              className="text-xs"
              style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
            >
              {wish.message}
            </p>
          </div>
        ))}
      </div>
      {onSubmitWish && <WishForm theme={theme} onSubmitWish={onSubmitWish} />}
    </section>
  );
}

function WishForm({
  theme,
  onSubmitWish,
}: {
  theme: TemplateProps["theme"];
  onSubmitWish: NonNullable<TemplateProps["onSubmitWish"]>;
}) {
  return (
    <form
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const guestName = String(formData.get("guestName") ?? "");
        const message = String(formData.get("message") ?? "");
        if (!guestName || !message) return;
        await onSubmitWish(guestName, message);
        form.reset();
      }}
    >
      <input
        name="guestName"
        placeholder="Nama"
        required
        className="w-24 rounded-lg border-0 px-3 py-2 text-xs"
        style={{ backgroundColor: theme.surface, color: theme.text }}
      />
      <input
        name="message"
        placeholder="Tulis ucapan..."
        required
        className="flex-1 rounded-lg border-0 px-3 py-2 text-xs"
        style={{ backgroundColor: theme.surface, color: theme.text }}
      />
      <button
        type="submit"
        className="rounded-lg px-3 py-2 text-xs font-medium"
        style={{ backgroundColor: theme.accent, color: theme.background }}
      >
        Kirim
      </button>
    </form>
  );
}
