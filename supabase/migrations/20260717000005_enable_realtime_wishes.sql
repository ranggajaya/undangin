-- Supabase Realtime tidak mengirim perubahan tabel apapun secara default —
-- harus didaftarkan eksplisit ke publication `supabase_realtime`.
-- Tanpa ini, subscription postgres_changes di client tidak akan pernah
-- menerima event apapun meskipun kode client-nya benar.
alter publication supabase_realtime add table public.wishes;
