import type { ThemeConfig } from "../types";

// Palet krem-emas, kesan elegan/formal — kontras dengan rosea-minimal
// yang gelap-modern. Dipakai sebagai default_theme_config di database.
export const sandingEleganTheme: ThemeConfig = {
  background: "#FBF5EA",
  surface: "#F1E4C8",
  text: "#4A3728",
  textMuted: "#8C7B6B",
  accent: "#B8860B",
  accentSecondary: "#7A2E2E",
  fontHeading: "var(--font-heading)",
  fontBody: "var(--font-body)",
};
