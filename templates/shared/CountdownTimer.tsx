"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateProps } from "../types";

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({
  targetDate,
  theme,
}: {
  targetDate: string;
  theme: TemplateProps["theme"];
}) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(
    null
  );

  useEffect(() => {
    // Dihitung pertama kali di client (bukan server) supaya tidak ada
    // mismatch hydration antara waktu server render dan waktu browser.
    setTimeLeft(getTimeLeft(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  const units = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-3">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div
            className="mb-1 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl"
            style={{ backgroundColor: theme.surface }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-lg font-semibold"
                style={{ fontFamily: theme.fontHeading }}
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          <span
            className="text-[10px] uppercase tracking-wide"
            style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
          >
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
