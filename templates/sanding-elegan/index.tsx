"use client";

import type { TemplateProps } from "../types";
import { WallOfWishes } from "../shared/WallOfWishes";
import { Watermark } from "../shared/Watermark";

// Template "sanding elegan" — kategori: elegan. Foto bulat di tengah,
// pembatas ornamental, tata letak formal/simetris — beda total dari
// rosea-minimal yang modern-linear.
export default function SandingEleganTemplate({
  invitationId,
  data,
  theme,
  showWatermark,
  onSubmitWish,
}: TemplateProps) {
  const mainEvent = data.events[0];

  return (
    <main
      className="mx-auto min-h-screen max-w-md px-6 py-12 text-center"
      style={{ background: theme.background, color: theme.text }}
    >
      <Divider theme={theme} />

      <p
        className="mb-4 mt-6 text-[11px] tracking-[0.3em]"
        style={{ color: theme.accentSecondary, fontFamily: theme.fontBody }}
      >
        UNDANGAN PERNIKAHAN
      </p>

      {data.coverPhotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.coverPhotoUrl}
          alt={`Foto ${data.groomName} & ${data.brideName}`}
          className="mx-auto mb-6 h-40 w-40 rounded-full border-4 object-cover"
          style={{ borderColor: theme.accent }}
        />
      ) : (
        <div
          className="mx-auto mb-6 h-40 w-40 rounded-full border-4"
          style={{ borderColor: theme.accent, backgroundColor: theme.surface }}
        />
      )}

      <h1
        className="mb-1 text-3xl italic"
        style={{ fontFamily: theme.fontHeading }}
      >
        {data.groomName}
      </h1>
      <p
        className="my-1 text-sm"
        style={{ color: theme.accent, fontFamily: theme.fontHeading }}
      >
        &amp;
      </p>
      <h1
        className="mb-4 text-3xl italic"
        style={{ fontFamily: theme.fontHeading }}
      >
        {data.brideName}
      </h1>

      {mainEvent && (
        <p
          className="mb-8 text-xs tracking-wide"
          style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
        >
          {new Date(mainEvent.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      <Divider theme={theme} />

      {data.events.length > 0 && (
        <section className="my-8 space-y-5">
          {data.events.map((event) => (
            <div key={event.label}>
              <p
                className="mb-1 text-sm font-semibold tracking-wide"
                style={{ color: theme.accentSecondary, fontFamily: theme.fontHeading }}
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
              </p>
              <p
                className="text-sm"
                style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
              >
                {event.time} · {event.location}
              </p>
            </div>
          ))}
        </section>
      )}

      {data.loveStory && (
        <section className="my-8">
          <h2
            className="mb-2 text-lg italic"
            style={{ fontFamily: theme.fontHeading }}
          >
            Kisah Kami
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
        <section className="my-8 grid grid-cols-3 gap-2">
          {data.galleryPhotoUrls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt="Galeri foto pasangan"
              className="aspect-square w-full rounded-lg object-cover"
            />
          ))}
        </section>
      )}

      {data.giftInfo && (
        <section
          className="my-8 rounded-lg border p-4 text-center"
          style={{ borderColor: theme.accent }}
        >
          <h2
            className="mb-2 text-sm font-semibold tracking-wide"
            style={{ color: theme.accentSecondary, fontFamily: theme.fontHeading }}
          >
            Tanda Kasih
          </h2>
          <p
            className="text-sm"
            style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
          >
            {data.giftInfo}
          </p>
        </section>
      )}

      <Divider theme={theme} />

      <div className="mt-8">
        <WallOfWishes
          invitationId={invitationId}
          initialWishes={data.wishes}
          theme={theme}
          onSubmitWish={onSubmitWish}
        />
      </div>

      {showWatermark && <Watermark />}
    </main>
  );
}

function Divider({ theme }: { theme: TemplateProps["theme"] }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className="h-px w-12"
        style={{ backgroundColor: theme.accent }}
      />
      <span style={{ color: theme.accent }}>❦</span>
      <span
        className="h-px w-12"
        style={{ backgroundColor: theme.accent }}
      />
    </div>
  );
}
