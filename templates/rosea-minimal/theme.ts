import type { ThemeConfig } from "../types";

// Theme gelap sesuai wireframe halaman publik undangan yang sudah disetujui.
// Nilai ini yang tersimpan sebagai default_theme_config di tabel `templates`.
export const roseaMinimalTheme: ThemeConfig = {
  background: "#2B2420",
  surface: "#3D352E",
  text: "#FDF8F4",
  textMuted: "#B4AFA5",
  accent: "#C17767",
  accentSecondary: "#8A9A7E",
  fontHeading: "var(--font-heading)",
  fontBody: "var(--font-body)",
};
