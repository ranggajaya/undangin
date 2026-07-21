"use client";

import { useState } from "react";
import {
  searchInvitationBySlug,
  extendInvitationActivePeriod,
} from "@/lib/actions/admin-support";

interface InvitationRow {
  id: string;
  slug: string;
  status: string;
  package: string | null;
  masa_aktif_mulai: string | null;
  masa_aktif_selesai: string | null;
}

export default function AdminSupportPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<InvitationRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await searchInvitationBySlug(query.trim());
      setResults(data ?? []);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExtend = async (id: string) => {
    try {
      await extendInvitationActivePeriod(id, 1);
      setMessage("Masa aktif diperpanjang 1 bulan.");
      handleSearch();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal memperpanjang.");
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl text-ink">Customer Support</h1>

      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm"
          placeholder="Cari berdasarkan slug undangan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-cream"
        >
          {isSearching ? "Mencari..." : "Cari"}
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-sage">{message}</p>}

      <div className="space-y-2">
        {results.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4"
          >
            <div>
              <p className="text-sm font-medium text-ink">{inv.slug}</p>
              <p className="text-xs text-ink/50">
                {inv.status} · paket {inv.package ?? "-"} · aktif s/d{" "}
                {inv.masa_aktif_selesai
                  ? new Date(inv.masa_aktif_selesai).toLocaleDateString("id-ID")
                  : "-"}
              </p>
            </div>
            <button
              onClick={() => handleExtend(inv.id)}
              className="rounded-lg border border-terracotta px-3 py-1.5 text-xs font-medium text-terracotta"
            >
              + 1 bulan
            </button>
          </div>
        ))}
        {results.length === 0 && query && !isSearching && (
          <p className="text-sm text-ink/40">Tidak ada hasil.</p>
        )}
      </div>
    </div>
  );
}
