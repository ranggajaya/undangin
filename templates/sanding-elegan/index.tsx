"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { TemplateProps } from "../types";
import { WallOfWishes } from "../shared/WallOfWishes";
import { Watermark } from "../shared/Watermark";
import { OpeningScreen } from "../shared/OpeningScreen";
import { CountdownTimer } from "../shared/CountdownTimer";
import { Reveal } from "../shared/Reveal";
import { MusicPlayer, type MusicPlayerHandle } from "../shared/MusicPlayer";

// Template "sanding elegan" — kategori: elegan. Foto bulat di tengah,
// pembatas ornamental, tata letak formal/simetris.
export default function SandingEleganTemplate({
  invitationId,
  data,
  theme,
  showWatermark,
  guestName,
  onSubmitWish,
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState(false);
  const musicRef = useRef<MusicPlayerHandle>(null);
  const mainEvent = data.events[0];

  return (
    <>
      <OpeningScreen
        groomName={data.groomName}
        brideName={data.brideName}
        guestName={guestName}
        theme={theme}
        isOpen={isOpened}
        onOpen={() => {
          setIsOpened(true);
          musicRef.current?.play();
        }}
      />

      {data.audioUrl && <MusicPlayer ref={musicRef} audioUrl={data.audioUrl} theme={theme} />}

      <main
        className="mx-auto min-h-screen max-w-md px-6 py-12 text-center"
        style={{ background: theme.background, color: theme.text }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpened ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
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

          <h1 className="mb-1 text-3xl italic" style={{ fontFamily: theme.fontHeading }}>
            {data.groomName}
          </h1>
          <p className="my-1 text-sm" style={{ color: theme.accent, fontFamily: theme.fontHeading }}>
            &amp;
          </p>
          <h1 className="mb-4 text-3xl italic" style={{ fontFamily: theme.fontHeading }}>
            {data.brideName}
          </h1>

          {mainEvent && (
            <>
              <p
                className="mb-6 text-xs tracking-wide"
                style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
              >
                {new Date(mainEvent.date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="mb-6">
                <CountdownTimer targetDate={mainEvent.date} theme={theme} />
              </div>
            </>
          )}
        </motion.div>

        <Divider theme={theme} />

        {data.events.length > 0 && (
          <Reveal>
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
                  <p className="text-sm" style={{ color: theme.textMuted, fontFamily: theme.fontBody }}>
                    {event.time} · {event.location}
                  </p>
                </div>
              ))}
            </section>
          </Reveal>
        )}

        {data.loveStory && (
          <Reveal delay={0.1}>
            <section className="my-8">
              <h2 className="mb-2 text-lg italic" style={{ fontFamily: theme.fontHeading }}>
                Kisah Kami
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.textMuted, fontFamily: theme.fontBody }}>
                {data.loveStory}
              </p>
            </section>
          </Reveal>
        )}

        {data.galleryPhotoUrls.length > 0 && (
          <Reveal delay={0.1}>
            <section className="my-8 grid grid-cols-3 gap-2">
              {data.galleryPhotoUrls.map((url, i) => (
                <motion.img
                  key={url}
                  src={url}
                  alt="Galeri foto pasangan"
                  className="aspect-square w-full rounded-lg object-cover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                />
              ))}
            </section>
          </Reveal>
        )}

        {data.giftInfo && (
          <Reveal>
            <section className="my-8 rounded-lg border p-4 text-center" style={{ borderColor: theme.accent }}>
              <h2 className="mb-2 text-sm font-semibold tracking-wide" style={{ color: theme.accentSecondary, fontFamily: theme.fontHeading }}>
                Tanda Kasih
              </h2>
              <p className="text-sm" style={{ color: theme.textMuted, fontFamily: theme.fontBody }}>
                {data.giftInfo}
              </p>
            </section>
          </Reveal>
        )}

        <Divider theme={theme} />

        <Reveal>
          <div className="mt-8">
            <WallOfWishes
              invitationId={invitationId}
              initialWishes={data.wishes}
              theme={theme}
              onSubmitWish={onSubmitWish}
            />
          </div>
        </Reveal>

        {showWatermark && <Watermark />}
      </main>
    </>
  );
}

function Divider({ theme }: { theme: TemplateProps["theme"] }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-12" style={{ backgroundColor: theme.accent }} />
      <span style={{ color: theme.accent }}>❦</span>
      <span className="h-px w-12" style={{ backgroundColor: theme.accent }} />
    </div>
  );
}
