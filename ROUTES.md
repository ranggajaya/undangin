# Routes — Undangin

Next.js App Router **tidak punya file route terpusat** seperti
`routes/api.php` di Laravel — struktur folder di `app/` itu sendiri yang
menentukan URL-nya (file-based routing). Dokumen ini dibuat manual sebagai
pengganti, supaya tetap ada satu tempat untuk lihat semua endpoint.

**⚠️ Wajib diupdate manual setiap kali nambah route baru** — tidak ada
mekanisme otomatis yang menjaga file ini tetap sinkron dengan kode.

---

## Route Handler (punya URL asli, bisa diakses dari luar)

| Method | URL | File | Auth | Fungsi |
|---|---|---|---|---|
| GET | `/api/cron/cleanup-drafts` | `app/api/cron/cleanup-drafts/route.ts` | `CRON_SECRET` (dikirim otomatis oleh Vercel Cron) | Hapus draft tidak aktif >60 hari + asset di Storage |
| POST | `/api/midtrans/webhook` | `app/api/midtrans/webhook/route.ts` | Signature Midtrans (bukan session user) | Terima notifikasi status pembayaran, aktivasi undangan |
| GET | `/auth/callback` | `app/auth/callback/route.ts` | Public | Tukar `code` OAuth/email jadi session aktif |

## Server Actions (dipanggil dari dalam kode React, bukan URL publik)

| Fungsi | File | Dipanggil dari | Auth |
|---|---|---|---|
| `createDraftInvitation()` | `lib/actions/invitations.ts` | `/dashboard` | User login |
| `saveDraftInvitation(id, data)` | `lib/actions/invitations.ts` | `EditorForm.tsx` (auto-save) | User login, cek ownership |
| `uploadInvitationAsset(id, formData)` | `lib/actions/invitations.ts` | `EditorForm.tsx` (upload foto) | User login |
| `initiatePublish(id, packageId?)` | `lib/actions/publish.ts` | `PublishButton.tsx` | User login, cek ownership |
| `submitWish(slug, guestName, message)` | `lib/actions/wishes.ts` | Form ucapan di `/u/[slug]` (lewat inline server action) | Public (siapa saja) |
| `createTemplate` / `updateTemplate` / `toggleTemplateActive` | `lib/actions/admin-templates.ts` | `/admin/templates/*` | template_admin, super_admin |
| `searchInvitationBySlug` / `extendInvitationActivePeriod` | `lib/actions/admin-support.ts` | `/admin/support` | customer_support, super_admin |
| `updateUserRole` | `lib/actions/admin-users.ts` | `/admin/users` | super_admin |

## Halaman Admin (role-gated di `app/admin/layout.tsx`)

| URL | Auth |
|---|---|
| `/admin` | Redirect ke section pertama sesuai role |
| `/admin/templates` , `/admin/templates/new` , `/admin/templates/[id]` | template_admin, super_admin |
| `/admin/support` | customer_support, super_admin |
| `/admin/users` | super_admin saja |

## Halaman (page.tsx — bukan API, tapi didaftar untuk kelengkapan peta situs)

| URL | File | Auth |
|---|---|---|
| `/` | `app/page.tsx` | Public |
| `/register` | `app/register/page.tsx` | Public |
| `/login` | `app/login/page.tsx` | Public |
| `/forgot-password` | `app/forgot-password/page.tsx` | Public |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Public (butuh session dari callback) |
| `/dashboard` | `app/dashboard/page.tsx` | User login |
| `/editor/[id]` | `app/editor/[id]/page.tsx` | User login, cek ownership |
| `/u/[slug]` | `app/u/[slug]/page.tsx` | Public |

---

## Belum ada (menyusul issue selanjutnya)
- `/katalog` — belum ada issue resminya, perlu ditambahkan (lihat diskusi produk)
- Panel admin (`/admin/...`) — issue `#9`
- Custom domain resolver di middleware — issue `#12`
