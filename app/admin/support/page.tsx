"use client";

import { useState } from "react";
import { Search, Calendar, PlusCircle, Headset } from "lucide-react";
import {
  searchInvitationBySlug,
  extendInvitationActivePeriod,
} from "@/lib/actions/admin-support";
import { PageHeader, EmptyState } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await searchInvitationBySlug(query.trim());
      setResults(data ?? []);
      setHasSearched(true);
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
      <PageHeader
        title="Customer Support"
        description="Cari undangan user untuk bantu troubleshoot atau perpanjang masa aktif."
      />

      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/30"
          />
          <input
            className="w-full rounded-lg border border-ink/15 py-2.5 pl-9 pr-3 text-sm focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            placeholder="Cari berdasarkan slug undangan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Mencari..." : "Cari"}
        </Button>
      </div>

      {message && (
        <p className="mb-4 rounded-lg bg-sage/10 px-3 py-2 text-sm text-sage">
          {message}
        </p>
      )}

      {hasSearched && results.length === 0 && !isSearching ? (
        <EmptyState
          icon={<Headset size={20} strokeWidth={1.5} />}
          title="Tidak ada hasil"
          description={`Tidak ditemukan undangan dengan slug mengandung "${query}".`}
        />
      ) : (
        <div className="space-y-2">
          {results.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-4"
            >
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">{inv.slug}</p>
                  <Badge tone={inv.status === "published" ? "sage" : "neutral"}>
                    {inv.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="flex items-center gap-1 text-xs text-ink/50">
                  <Calendar size={12} />
                  Paket {inv.package ?? "-"} · aktif s/d{" "}
                  {inv.masa_aktif_selesai
                    ? new Date(inv.masa_aktif_selesai).toLocaleDateString("id-ID")
                    : "-"}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<PlusCircle size={14} />}
                onClick={() => handleExtend(inv.id)}
              >
                1 bulan
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
