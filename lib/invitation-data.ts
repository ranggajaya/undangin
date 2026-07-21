import type { InvitationEvent } from "@/templates/types";

// Data yang tersimpan di kolom `invitations.data` (jsonb).
// Tidak termasuk `wishes` — itu diambil live dari tabel `wishes` terpisah.
export interface DraftInvitationData {
  groomName: string;
  brideName: string;
  coverPhotoUrl?: string;
  galleryPhotoUrls: string[];
  loveStory?: string;
  giftInfo?: string;
  audioUrl?: string;
  akad: InvitationEvent;
  resepsi: InvitationEvent;
}

const EMPTY_EVENT: InvitationEvent = {
  label: "",
  date: "",
  time: "",
  location: "",
};

export const EMPTY_DRAFT_DATA: DraftInvitationData = {
  groomName: "",
  brideName: "",
  galleryPhotoUrls: [],
  akad: { ...EMPTY_EVENT, label: "Akad Nikah" },
  resepsi: { ...EMPTY_EVENT, label: "Resepsi" },
};
