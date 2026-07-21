import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// PERINGATAN: client ini pakai service role key yang BYPASS semua RLS.
// JANGAN PERNAH import file ini dari client component atau kirim key-nya
// ke browser. Hanya dipakai di konteks server tepercaya (webhook, cron job)
// yang tidak punya session user untuk diautentikasi lewat cookie.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diset."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
