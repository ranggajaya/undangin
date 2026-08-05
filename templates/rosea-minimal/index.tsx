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

// Template "rosea minimal" — kategori: minimalis. Latar gelap, tipografi
// besar, layout satu kolom lurus ke bawah — kesan clean dan modern.
export default function RoseaMinimalTemplate({
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
        className="mx-auto min-h-screen max-w-md px-5 py-10 text-center"
        style={{ background: theme.background, color: theme.text }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpened ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
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
              className="mb-6 text-xs"
              style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
            >
              {new Date(mainEvent.date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          {mainEvent && (
            <div className="mb-8">
              <CountdownTimer targetDate={mainEvent.date} theme={theme} />
            </div>
          )}

          {data.coverPhotoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.coverPhotoUrl}
              alt={`Foto ${data.groomName} & ${data.brideName}`}
              className="mb-8 h-64 w-full rounded-xl object-cover"
            />
          )}
        </motion.div>

        {data.events.length > 0 && (
          <Reveal>
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
          </Reveal>
        )}

        {data.loveStory && (
          <Reveal delay={0.1}>
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
          </Reveal>
        )}

        {data.galleryPhotoUrls.length > 0 && (
          <Reveal delay={0.1}>
            <section className="mb-8 grid grid-cols-2 gap-2">
              {data.galleryPhotoUrls.map((url, i) => (
                <motion.img
                  key={url}
                  src={url}
                  alt="Galeri foto pasangan"
                  className="h-32 w-full rounded-lg object-cover"
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
          </Reveal>
        )}

        <Reveal>
          <WallOfWishes
            invitationId={invitationId}
            initialWishes={data.wishes}
            theme={theme}
            onSubmitWish={onSubmitWish}
          />
        </Reveal>

        {showWatermark && <Watermark />}
      </main>
    </>
  );
}
