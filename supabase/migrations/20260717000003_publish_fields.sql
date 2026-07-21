-- Kolom tambahan untuk mendukung alur publish (issue #6):
-- - profiles.has_used_free_publish: jatah 1x publish gratis per akun
-- - invitations.package: paket yang dipakai saat publish (free/basic/premium)
-- - transactions.package: paket yang dibeli di transaksi ini

alter table public.profiles
  add column if not exists has_used_free_publish boolean default false not null;

alter table public.invitations
  add column if not exists package text check (package in ('free', 'basic', 'premium'));

alter table public.transactions
  add column if not exists package text check (package in ('basic', 'premium'));

-- Policy INSERT belum pernah dibuat untuk transactions (migration awal hanya
-- punya SELECT) — dibutuhkan supaya user bisa membuat transaksi Midtrans
-- untuk undangannya sendiri.
create policy "Pengguna dapat membuat transaksi miliknya sendiri"
  on public.transactions for insert
  with check (auth.uid() = user_id);
