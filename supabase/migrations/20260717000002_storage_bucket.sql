-- Bucket untuk foto galeri, foto cover, dan audio latar undangan.
-- Dibuat public-read karena akan ditampilkan di halaman undangan publik,
-- tapi write dibatasi hanya untuk pemilik undangan lewat RLS di bawah.
insert into storage.buckets (id, name, public)
values ('invitation-assets', 'invitation-assets', true)
on conflict (id) do nothing;

create policy "Siapa saja dapat melihat asset undangan"
  on storage.objects for select
  using (bucket_id = 'invitation-assets');

create policy "Pengguna dapat upload asset ke folder miliknya sendiri"
  on storage.objects for insert
  with check (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Pengguna dapat hapus asset miliknya sendiri"
  on storage.objects for delete
  using (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
