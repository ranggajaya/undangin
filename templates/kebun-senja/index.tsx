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

// Template "kebun senja" — kategori: rustic/taman. Hero foto full-bleed,
// konten dalam kartu mengambang, kesan hangat & organik.
export default function KebunSenjaTemplate({
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
        className="mx-auto min-h-screen max-w-md"
        style={{ background: theme.background, color: theme.text }}
      >
        <motion.div
          className="relative h-72 w-full overflow-hidden rounded-b-[40px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpened ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {data.coverPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.coverPhotoUrl}
              alt={`Foto ${data.groomName} & ${data.brideName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full" style={{ backgroundColor: theme.surface }} />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-5 pt-14 text-left">
            <p className="mb-1 text-[11px] tracking-[0.2em] text-white/80">KAMI MENIKAH</p>
            <h1 className="font-heading text-2xl text-white">
              {data.groomName} &amp; {data.brideName}
            </h1>
          </div>
        </motion.div>

        <div className="px-5 py-8">
          {mainEvent && (
            <>
              <p
                className="mb-4 text-center text-xs"
                style={{ color: theme.text, fontFamily: theme.fontBody }}
              >
                {new Date(mainEvent.date).toLocaleDateString("id-ID", {
                  weekday: "long",
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

          {data.events.length > 0 && (
            <Reveal>
              <section className="mb-6 grid grid-cols-1 gap-3">
                {data.events.map((event) => (
                  <div
                    key={event.label}
                    className="rounded-3xl p-4 text-left shadow-sm"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <p className="mb-1 text-sm font-semibold" style={{ color: theme.accentSecondary, fontFamily: theme.fontHeading }}>
                      {event.label}
                    </p>
                    <p className="text-sm" style={{ fontFamily: theme.fontBody }}>{event.time}</p>
                    <p className="text-sm" style={{ color: theme.textMuted, fontFamily: theme.fontBody }}>
                      {event.location}
                    </p>
                  </div>
                ))}
              </section>
            </Reveal>
          )}

          {data.loveStory && (
            <Reveal delay={0.1}>
              <section className="mb-6 rounded-3xl p-5" style={{ backgroundColor: theme.surface }}>
                <h2 className="mb-2 text-lg" style={{ fontFamily: theme.fontHeading, color: theme.accentSecondary }}>
                  🌿 Cerita Kami
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: theme.textMuted, fontFamily: theme.fontBody }}>
                  {data.loveStory}
                </p>
              </section>
            </Reveal>
          )}

          {data.galleryPhotoUrls.length > 0 && (
            <Reveal delay={0.1}>
              <section className="mb-6 grid grid-cols-2 gap-2">
                {data.galleryPhotoUrls.map((url, i) => (
                  <motion.img
                    key={url}
                    src={url}
                    alt="Galeri foto pasangan"
                    className="h-32 w-full rounded-2xl object-cover"
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
              <section className="mb-6 rounded-3xl p-5 text-left" style={{ backgroundColor: theme.surface }}>
                <h2 className="mb-2 text-sm font-semibold" style={{ color: theme.accent, fontFamily: theme.fontHeading }}>
                  🎁 Kirim Hadiah
                </h2>
                <p className="text-sm" style={{ color: theme.textMuted, fontFamily: theme.fontBody }}>
                  {data.giftInfo}
                </p>
              </section>
            </Reveal>
          )}

          <Reveal>
            <div className="rounded-3xl p-5" style={{ backgroundColor: theme.surface }}>
              <WallOfWishes
                invitationId={invitationId}
                initialWishes={data.wishes}
                theme={{ ...theme, background: theme.surface }}
                onSubmitWish={onSubmitWish}
              />
            </div>
          </Reveal>

          {showWatermark && <Watermark />}
        </div>
      </main>
    </>
  );
}
