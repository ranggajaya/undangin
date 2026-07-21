// Data contract yang WAJIB dipenuhi semua komponen template.
// Setiap desain baru menerima props dengan bentuk yang sama persis,
// supaya editor & sistem publish tidak perlu tahu template mana yang dipakai.

export interface InvitationEvent {
  label: string; // contoh: "Akad Nikah", "Resepsi"
  date: string; // ISO date string, contoh: "2026-09-12"
  time: string; // contoh: "08:00 - 10:00 WIB"
  location: string;
  mapsUrl?: string;
}

export interface InvitationWish {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
}

export interface InvitationData {
  groomName: string;
  brideName: string;
  coverPhotoUrl?: string;
  galleryPhotoUrls: string[];
  loveStory?: string;
  giftInfo?: string;
  events: InvitationEvent[];
  wishes: InvitationWish[];
  audioUrl?: string;
}

// Warna/font per template — didefinisikan oleh pembuat template,
// TIDAK BISA di-override end user (lihat PRD bagian 4).
export interface ThemeConfig {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  fontHeading: string;
  fontBody: string;
}

// Props seragam yang diterima SEMUA komponen template.
export interface TemplateProps {
  invitationId: string;
  data: InvitationData;
  theme: ThemeConfig;
  showWatermark?: boolean;
  onSubmitWish?: (guestName: string, message: string) => Promise<void>;
}

// Metadata untuk entry di registry (dipakai katalog & admin panel).
export interface TemplateMeta {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  defaultTheme: ThemeConfig;
}
