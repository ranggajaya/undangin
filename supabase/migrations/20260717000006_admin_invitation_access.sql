-- Policy invitations yang ada sekarang cuma izinkan pemilik akses
-- undangannya sendiri. Customer Support & Super Admin butuh bisa lihat dan
-- extend masa_aktif undangan siapa saja (lihat PRD bagian 6.6 & 7).

create policy "Admin dapat melihat semua undangan" on public.invitations
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('customer_support', 'super_admin')
    )
  );

create policy "Admin dapat mengupdate undangan siapa saja" on public.invitations
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('customer_support', 'super_admin')
    )
  );
