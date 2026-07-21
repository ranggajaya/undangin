# Design System — Undangin

Identitas visual ini berlaku untuk **shell produk**: landing page, dashboard
user, dan admin panel. Katalog template undangan (15 desain) punya
`themeConfig` masing-masing dan tidak wajib mengikuti sistem ini.

## 1. Visual Theme & Atmosphere

Undangin dibangun untuk terasa **hangat dan personal**, bukan seperti tools
teknis. Fondasinya adalah latar krem hangat yang mengingatkan pada kertas
undangan fisik, dipadukan aksen terracotta yang romantis tapi tetap elegan —
bukan warna pastel generik yang sering dipakai di produk sejenis. Sudut
membulat lembut dan shadow tipis menjaga kesan hangat tanpa jatuh ke kesan
murah.

**Key Characteristics:**
- Latar krem hangat (`#FDF8F4`) — bukan putih dingin
- Teks utama coklat gelap (`#2B2420`) — lebih lembut dari hitam pekat
- Aksen romantis: terracotta (`#C17767`) untuk CTA/aksi utama
- Aksen pendukung: sage green (`#8A9A7E`) untuk badge/status
- Heading serif elegan, body sans-serif bersih — kontras yang disengaja
- Sudut membulat besar, shadow tipis, banyak whitespace
- Tampilan foto-forward — galeri jadi elemen visual utama, bukan sekadar dekorasi

## 2. Color Palette & Roles

| Warna | Hex | Fungsi |
|---|---|---|
| Krem hangat | `#FDF8F4` | Latar utama semua halaman |
| Coklat gelap (ink) | `#2B2420` | Teks utama, juga dipakai sebagai latar gelap di halaman publik undangan |
| Terracotta | `#C17767` | Aksen utama — tombol primer, link penting, CTA |
| Sage green | `#8A9A7E` | Aksen kedua — badge status ("draft tersimpan"), elemen pendukung |
| Ink muted (70%) | `#2B2420` @ 70% opacity | Teks sekunder/deskripsi |
| Border netral | `#D8D3C8` | Border input, divider |
| Surface kartu | `#EFE7DC` | Latar placeholder gambar/thumbnail |

## 3. Typography

### Font Families
- **Heading**: `Fraunces` (serif) — dipakai di `next/font/google`, variabel CSS `--font-heading`
- **Body/UI**: `Plus Jakarta Sans` (sans-serif) — variabel CSS `--font-body`

### Prinsip
- Heading selalu pakai font serif untuk kesan personal/romantis — jangan pernah pakai sans-serif untuk judul besar
- Body & elemen UI (form, tombol, label) selalu sans-serif agar mudah dibaca di form panjang
- Hindari huruf kapital semua (uppercase) untuk body text — hanya untuk label kecil/tag kategori

## 4. Component Styling

### Tombol
- **Primer**: latar terracotta (`#C17767`), teks krem, radius 8-10px
- **Sekunder/outline**: transparan, border coklat gelap (`#2B2420`), radius sama dengan primer

### Kartu & Kontainer
- Radius membulat besar (10-14px), bukan tajam
- Border tipis netral (`#D8D3C8`) kalau perlu pemisah, hindari shadow tebal

### Halaman Publik Undangan (khusus)
- Boleh pakai latar gelap (`#2B2420`) sebagai basis, dengan aksen terracotta/sage — kontras dengan shell produk yang terang, untuk memberi kesan "acara malam yang syahdu"
- Ini berbeda dari dashboard/landing yang selalu terang (`#FDF8F4`)

## 5. Referensi Wireframe

Tiga alur utama sudah punya wireframe (dibuat saat sesi PRD, lihat riwayat
diskusi produk): katalog/browse desain, editor pengisian data, dan halaman
publik undangan. Pola yang konsisten di ketiganya:
- Header sederhana dengan logo teks "undangin" (font heading, huruf kecil semua)
- Navigasi minim, fokus ke satu aksi utama per layar
- Preview mini selalu terlihat saat user sedang mengedit data

## 6. Yang Harus Dihindari

- Jangan pakai palet warna dingin/tech (biru-abu, monokrom murni) — itu identitas studio cooreidev, bukan identitas produk Undangin
- Jangan pakai shadow tebal bergaya "flat design" generik
- Jangan campur lebih dari 2 aksen warna dalam satu layar (terracotta + sage sudah cukup)
