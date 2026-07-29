import type { ThemeConfig } from "../types";

// Palet hangat senja-taman: gradient amber ke sage, kesan organik & ceria —
// beda dari 2 template lain yang solid color. `background` sengaja diisi
// nilai CSS gradient (valid, karena cuma dipakai sebagai style.background).
export const kebunSenjaTheme: ThemeConfig = {
  background: "linear-gradient(180deg, #FBEAD2 0%, #F3C88F 45%, #E3A96A 100%)",
  surface: "#FFF8ED",
  text: "#4A3B24",
  textMuted: "#7A6A4E",
  accent: "#C97B3D",
  accentSecondary: "#6B8A5E",
  fontHeading: "var(--font-heading)",
  fontBody: "var(--font-body)",
};
