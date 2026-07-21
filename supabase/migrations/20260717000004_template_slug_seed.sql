-- Kolom `slug` menghubungkan row di tabel `templates` ke key di
-- `templates/registry.tsx` (kode). Tanpa ini, tidak ada cara mengetahui
-- komponen React mana yang harus dipakai untuk render invitation tertentu.
alter table public.templates
  add column if not exists slug text unique;

alter table public.templates
  add column if not exists name text;

-- Seed template pertama yang sudah dibuat di issue #4.
-- default_theme_config di sini HARUS sama persis dengan
-- templates/rosea-minimal/theme.ts di kode (itu cuma fallback kalau row
-- ini belum ada; sumber kebenaran yang sebenarnya ada di database).
insert into public.templates (slug, name, kategori, thumbnail_url, default_theme_config, is_active)
values (
  'rosea-minimal',
  'Rosea Minimal',
  'minimalis',
  '/templates/rosea-minimal/thumbnail.jpg',
  '{
    "background": "#2B2420",
    "surface": "#3D352E",
    "text": "#FDF8F4",
    "textMuted": "#B4AFA5",
    "accent": "#C17767",
    "accentSecondary": "#8A9A7E",
    "fontHeading": "var(--font-heading)",
    "fontBody": "var(--font-body)"
  }'::jsonb,
  true
)
on conflict (slug) do nothing;
