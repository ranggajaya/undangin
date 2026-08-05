"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { TemplateProps } from "../types";

export function OpeningScreen({
  groomName,
  brideName,
  guestName,
  theme,
  isOpen,
  onOpen,
}: {
  groomName: string;
  brideName: string;
  guestName?: string;
  theme: TemplateProps["theme"];
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
          style={{ background: theme.background, color: theme.text }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-3 text-xs tracking-[0.3em]"
            style={{ color: theme.accent, fontFamily: theme.fontBody }}
          >
            THE WEDDING OF
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mb-8 text-4xl"
            style={{ fontFamily: theme.fontHeading }}
          >
            {groomName} &amp; {brideName}
          </motion.h1>

          {guestName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mb-10"
            >
              <p
                className="text-[11px] tracking-wide"
                style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
              >
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <p
                className="text-lg font-medium"
                style={{ fontFamily: theme.fontHeading }}
              >
                {guestName}
              </p>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpen}
            className="rounded-full px-8 py-3 text-sm font-medium shadow-lg"
            style={{ backgroundColor: theme.accent, color: theme.background }}
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
