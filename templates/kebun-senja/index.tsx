"use client";

import type { TemplateProps } from "../types";
import { WallOfWishes } from "../shared/WallOfWishes";
import { Watermark } from "../shared/Watermark";

// Template "kebun senja" — kategori: rustic/taman. Hero foto full-bleed di
// atas, konten dalam kartu mengambang dengan sudut sangat membulat — kesan
// hangat & organik, beda dari 2 template lain yang lebih formal/linear.
export default function KebunSenjaTemplate({
  invitationId,
  data,
  theme,
  showWatermark,
  onSubmitWish,
}: TemplateProps) {
  const mainEvent = data.events[0];

  return (
    <main
      className="mx-auto min-h-screen max-w-md"
      style={{ background: theme.background, color: theme.text }}
    >
      <div className="relative h-72 w-full overflow-hidden rounded-b-[40px]">
        {data.coverPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.coverPhotoUrl}
            alt={`Foto ${data.groomName} & ${data.brideName}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: theme.surface }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-5 pt-14 text-left">
          <p className="mb-1 text-[11px] tracking-[0.2em] text-white/80">
            KAMI MENIKAH
          </p>
          <h1 className="font-heading text-2xl text-white">
            {data.groomName} &amp; {data.brideName}
          </h1>
        </div>
      </div>

      <div className="px-5 py-8">
        {mainEvent && (
          <p
            className="mb-6 text-center text-xs"
            style={{ color: theme.text, fontFamily: theme.fontBody }}
          >
            {new Date(mainEvent.date).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {data.events.length > 0 && (
          <section className="mb-6 grid grid-cols-1 gap-3">
            {data.events.map((event) => (
              <div
                key={event.label}
                className="rounded-3xl p-4 text-left shadow-sm"
                style={{ backgroundColor: theme.surface }}
              >
                <p
                  className="mb-1 text-sm font-semibold"
                  style={{ color: theme.accentSecondary, fontFamily: theme.fontHeading }}
                >
                  {event.label}
                </p>
                <p className="text-sm" style={{ fontFamily: theme.fontBody }}>
                  {event.time}
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
          <section
            className="mb-6 rounded-3xl p-5"
            style={{ backgroundColor: theme.surface }}
          >
            <h2
              className="mb-2 text-lg"
              style={{ fontFamily: theme.fontHeading, color: theme.accentSecondary }}
            >
              🌿 Cerita Kami
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
          <section className="mb-6 grid grid-cols-2 gap-2">
            {data.galleryPhotoUrls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt="Galeri foto pasangan"
                className="h-32 w-full rounded-2xl object-cover"
              />
            ))}
          </section>
        )}

        {data.giftInfo && (
          <section
            className="mb-6 rounded-3xl p-5 text-left"
            style={{ backgroundColor: theme.surface }}
          >
            <h2
              className="mb-2 text-sm font-semibold"
              style={{ color: theme.accent, fontFamily: theme.fontHeading }}
            >
              🎁 Kirim Hadiah
            </h2>
            <p
              className="text-sm"
              style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
            >
              {data.giftInfo}
            </p>
          </section>
        )}

        <div
          className="rounded-3xl p-5"
          style={{ backgroundColor: theme.surface }}
        >
          <WallOfWishes
            invitationId={invitationId}
            initialWishes={data.wishes}
            theme={{ ...theme, background: theme.surface }}
            onSubmitWish={onSubmitWish}
          />
        </div>

        {showWatermark && <Watermark />}
      </div>
    </main>
  );
}
