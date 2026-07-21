import { Snap } from "midtrans-client";

// Harga & masa aktif per paket — PLACEHOLDER, sesuaikan sebelum go-live
// (lihat PRD bagian 10, poin nominal masih perlu diputuskan).
export const PACKAGES = {
  basic: { price: 49000, activeMonths: 6, label: "Basic" },
  premium: { price: 149000, activeMonths: 12, label: "Premium" },
} as const;

export type PackageId = keyof typeof PACKAGES;

export function createSnapClient() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  if (!serverKey || !clientKey) {
    throw new Error(
      "MIDTRANS_SERVER_KEY atau NEXT_PUBLIC_MIDTRANS_CLIENT_KEY belum diset di .env.local"
    );
  }

  return new Snap({ isProduction, serverKey, clientKey });
}
