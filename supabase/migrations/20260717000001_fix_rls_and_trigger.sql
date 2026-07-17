-- PATCH: Perbaikan keamanan dan bug dari hasil review kode
-- Jalankan file ini di SQL Editor Supabase SETELAH menjalankan 20260717000000_init_schema.sql

-- ============================================================
-- FIX 1: Perbaiki trigger handle_new_user — COALESCE full_name
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FIX 2: Buat helper function get_my_role() untuk menghindari
-- infinite recursion di RLS policy tabel profiles.
-- Fungsi ini berjalan dengan SECURITY DEFINER sehingga
-- mengabaikan RLS saat melakukan query, aman dari rekursi.
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- FIX 3: Hapus policy lama yang berpotensi infinite recursion
-- dan ganti dengan yang menggunakan get_my_role()
-- ============================================================

-- Hapus policy profiles yang bermasalah
DROP POLICY IF EXISTS "Super admin memiliki akses penuh ke profil" ON public.profiles;

-- Buat ulang dengan get_my_role()
CREATE POLICY "Super admin memiliki akses penuh ke profil" ON public.profiles
  FOR ALL USING (public.get_my_role() = 'super_admin');

-- Hapus policy templates yang bermasalah (subquery ke profiles)
DROP POLICY IF EXISTS "Template admin dapat mengelola template" ON public.templates;

-- Buat ulang dengan get_my_role()
CREATE POLICY "Template admin dapat mengelola template" ON public.templates
  FOR ALL USING (public.get_my_role() IN ('template_admin', 'super_admin'));

-- ============================================================
-- FIX 4: Perbaiki policy INSERT wishes — validasi invitation
-- harus berstatus 'published' sebelum boleh menerima ucapan
-- ============================================================
DROP POLICY IF EXISTS "Siapa saja dapat mengirimkan ucapan" ON public.wishes;

CREATE POLICY "Siapa saja dapat mengirimkan ucapan ke undangan aktif" ON public.wishes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = wishes.invitation_id
        AND invitations.status = 'published'
    )
  );
