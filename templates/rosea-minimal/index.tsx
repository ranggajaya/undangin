"use client";

import type { TemplateProps } from "../types";
import { WallOfWishes } from "../shared/WallOfWishes";
import { Watermark } from "../shared/Watermark";

// Template "rosea minimal" — kategori: minimalis. Latar gelap, tipografi
// besar, layout satu kolom lurus ke bawah — kesan clean dan modern.
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
      style={{ background: theme.background, color: theme.text }}
    >
      <p
        className="mb-2 text-xs tracking-[0.2em]"
        style={{ color: theme.accent, fontFamily: theme.fontBody }}
      >
        THE WEDDING OF
      </p>
      <h1 className="mb-1 text-3xl" style={{ fontFamily: theme.fontHeading }}>
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
          <h2 className="mb-2 text-lg" style={{ fontFamily: theme.fontHeading }}>
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
