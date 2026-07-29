"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TemplateProps } from "../types";

export function WallOfWishes({
  invitationId,
  initialWishes,
  theme,
  onSubmitWish,
}: {
  invitationId: string;
  initialWishes: TemplateProps["data"]["wishes"];
  theme: TemplateProps["theme"];
  onSubmitWish?: TemplateProps["onSubmitWish"];
}) {
  const [wishes, setWishes] = useState(initialWishes);

  useEffect(() => {
    const supabase = createClient();

    // Filter di level database (bukan filter di client) supaya browser
    // tidak menerima event dari undangan orang lain sama sekali.
    const channel = supabase
      .channel(`wishes-${invitationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wishes",
          filter: `invitation_id=eq.${invitationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            nama_tamu: string;
            pesan: string;
            created_at: string;
          };

          setWishes((prev) => {
            // Hindari duplikat kalau event yang sama entah kenapa masuk 2x
            // (Supabase Realtime kadang retry saat koneksi sempat putus).
            if (prev.some((w) => w.id === row.id)) return prev;
            return [
              {
                id: row.id,
                guestName: row.nama_tamu,
                message: row.pesan,
                createdAt: row.created_at,
              },
              ...prev,
            ];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId]);

  return (
    <section
      className="border-t pt-6 text-left"
      style={{ borderColor: theme.textMuted + "40" }}
    >
      <h2
        className="mb-3 text-sm font-semibold"
        style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
      >
        Ucapan &amp; Doa ({wishes.length})
      </h2>
      <div className="mb-4 max-h-72 space-y-2 overflow-y-auto">
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="rounded-lg p-3"
            style={{ backgroundColor: theme.surface }}
          >
            <p
              className="mb-0.5 text-xs font-semibold"
              style={{ fontFamily: theme.fontBody }}
            >
              {wish.guestName}
            </p>
            <p
              className="text-xs"
              style={{ color: theme.textMuted, fontFamily: theme.fontBody }}
            >
              {wish.message}
            </p>
          </div>
        ))}
      </div>
      {onSubmitWish && <WishForm theme={theme} onSubmitWish={onSubmitWish} />}
    </section>
  );
}

function WishForm({
  theme,
  onSubmitWish,
}: {
  theme: TemplateProps["theme"];
  onSubmitWish: NonNullable<TemplateProps["onSubmitWish"]>;
}) {
  return (
    <form
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const guestName = String(formData.get("guestName") ?? "");
        const message = String(formData.get("message") ?? "");
        if (!guestName || !message) return;
        await onSubmitWish(guestName, message);
        form.reset();
      }}
    >
      <input
        name="guestName"
        placeholder="Nama"
        required
        className="w-24 rounded-lg border-0 px-3 py-2 text-xs"
        style={{ backgroundColor: theme.surface, color: theme.text }}
      />
      <input
        name="message"
        placeholder="Tulis ucapan..."
        required
        className="flex-1 rounded-lg border-0 px-3 py-2 text-xs"
        style={{ backgroundColor: theme.surface, color: theme.text }}
      />
      <button
        type="submit"
        className="rounded-lg px-3 py-2 text-xs font-medium"
        style={{ backgroundColor: theme.accent, color: theme.background }}
      >
        Kirim
      </button>
    </form>
  );
}
