"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import type { TemplateProps } from "../types";

export interface MusicPlayerHandle {
  play: () => void;
}

export const MusicPlayer = forwardRef<
  MusicPlayerHandle,
  { audioUrl: string; theme: TemplateProps["theme"] }
>(function MusicPlayer({ audioUrl, theme }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      audioRef.current?.play().catch(() => {
        // Browser masih blokir autoplay (jarang terjadi karena ini
        // dipanggil dari klik "Buka Undangan") — biarkan user coba manual.
      });
      setIsPlaying(true);
    },
  }));

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop />
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        onClick={() => {
          if (isPlaying) {
            audioRef.current?.pause();
          } else {
            audioRef.current?.play().catch(() => {});
          }
          setIsPlaying(!isPlaying);
        }}
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
        style={{ backgroundColor: theme.accent, color: theme.background }}
      >
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isPlaying
              ? { repeat: Infinity, duration: 4, ease: "linear" }
              : { duration: 0.2 }
          }
        >
          {isPlaying ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </motion.div>
      </motion.button>
    </>
  );
});
