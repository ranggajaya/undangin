"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { initiatePublish } from "@/lib/actions/publish";
import type { PackageId } from "@/lib/midtrans";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const SNAP_SCRIPT_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve();

    const script = document.createElement("script");
    script.src = SNAP_SCRIPT_URL;
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""
    );
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Snap.js"));
    document.body.appendChild(script);
  });
}

export function PublishButton({
  invitationId,
  hasUsedFreePublish,
}: {
  invitationId: string;
  hasUsedFreePublish: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("basic");

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const result = await initiatePublish(
        invitationId,
        hasUsedFreePublish ? selectedPackage : undefined
      );

      if (result.kind === "free_published") {
        router.push(`/u/${result.slug}?published=1`);
        return;
      }

      // result.kind === "payment_required"
      await loadSnapScript();
      window.snap?.pay(result.snapToken, {
        onSuccess: () => router.push(`/editor/${invitationId}?paid=1`),
        onPending: () => router.push(`/editor/${invitationId}?pending=1`),
        onError: () => alert("Pembayaran gagal, silakan coba lagi."),
        onClose: () => setIsLoading(false),
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      if (hasUsedFreePublish) setIsLoading(false);
      // Untuk free publish, isLoading tetap true karena langsung redirect.
    }
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4">
      {!hasUsedFreePublish ? (
        <p className="mb-3 text-sm text-ink/70">
          Publish pertamamu <strong>gratis</strong> — aktif 1 bulan, ada
          watermark kecil.
        </p>
      ) : (
        <div className="mb-3">
          <p className="mb-2 text-sm text-ink/70">Pilih paket untuk publish:</p>
          <div className="flex gap-2">
            {(Object.keys({ basic: 0, premium: 0 }) as PackageId[]).map(
              (pkg) => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => setSelectedPackage(pkg)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize ${
                    selectedPackage === pkg
                      ? "border-terracotta bg-terracotta/10 text-terracotta"
                      : "border-ink/15 text-ink/60"
                  }`}
                >
                  {pkg}
                </button>
              )
            )}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={handlePublish}
        disabled={isLoading}
        className="w-full rounded-lg bg-terracotta px-4 py-2.5 text-sm font-medium text-cream disabled:opacity-50"
      >
        {isLoading ? "Memproses..." : "Publish Undangan"}
      </button>
    </div>
  );
}
