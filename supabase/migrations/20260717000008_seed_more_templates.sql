-- Seed 2 template baru (menyusul rosea-minimal). default_theme_config di
-- sini HARUS sama persis dengan file theme.ts di kode masing-masing.

insert into public.templates (slug, name, kategori, thumbnail_url, default_theme_config, is_active)
values (
  'sanding-elegan',
  'Sanding Elegan',
  'elegan',
  '/templates/sanding-elegan/thumbnail.jpg',
  '{
    "background": "#FBF5EA",
    "surface": "#F1E4C8",
    "text": "#4A3728",
    "textMuted": "#8C7B6B",
    "accent": "#B8860B",
    "accentSecondary": "#7A2E2E",
    "fontHeading": "var(--font-heading)",
    "fontBody": "var(--font-body)"
  }'::jsonb,
  true
)
on conflict (slug) do nothing;

insert into public.templates (slug, name, kategori, thumbnail_url, default_theme_config, is_active)
values (
  'kebun-senja',
  'Kebun Senja',
  'rustic',
  '/templates/kebun-senja/thumbnail.jpg',
  '{
    "background": "linear-gradient(180deg, #FBEAD2 0%, #F3C88F 45%, #E3A96A 100%)",
    "surface": "#FFF8ED",
    "text": "#4A3B24",
    "textMuted": "#7A6A4E",
    "accent": "#C97B3D",
    "accentSecondary": "#6B8A5E",
    "fontHeading": "var(--font-heading)",
    "fontBody": "var(--font-body)"
  }'::jsonb,
  true
)
on conflict (slug) do nothing;
