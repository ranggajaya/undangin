# Undangin

Platform self-service undangan digital pernikahan. Oleh cooreidev.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, Storage, Realtime)
- Midtrans Snap (pembayaran)
- Resend (email transaksional)

## Menjalankan secara lokal

1. Install dependencies:
   ```bash
   npm install
   ```

2. Salin file environment:
   ```bash
   cp .env.local.example .env.local
   ```
   Lalu isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari
   dashboard Supabase project kamu (Project Settings > API).

3. Jalankan dev server:
   ```bash
   npm run dev
   ```
   Buka http://localhost:3000

## Struktur folder
```
app/            # Routes (App Router)
components/     # Komponen UI reusable
lib/supabase/   # Client Supabase (browser & server)
templates/      # Komponen desain undangan (1 folder per template)
middleware.ts   # Refresh session Supabase di tiap request
```

## Progres development
Lihat GitHub Issues di repo ini — tiap issue punya acceptance criteria dan
referensi ke bagian PRD terkait. Urutan pengerjaan yang disarankan:
`#1` → `#3` → `#2` → `#4` → `#5` → `#6` → `#7` → `#8` → `#9` → `#10` → `#11` → `#12`
