-- Kolom `created_at` saja tidak cukup untuk tahu draft mana yang "tidak
-- aktif" — draft yang dibuat lama tapi masih rutin di-edit tidak boleh
-- ikut terhapus. Perlu `updated_at` yang ikut berubah tiap ada auto-save.

alter table public.invitations
  add column if not exists updated_at timestamp with time zone
  default timezone('utc'::text, now()) not null;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger on_invitations_updated
  before update on public.invitations
  for each row execute function public.set_updated_at();
