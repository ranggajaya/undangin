-- 1. Buat Tabel `profiles`
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('super_admin', 'template_admin', 'customer_support', 'user')),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Buat Tabel `templates`
CREATE TABLE public.templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kategori text NOT NULL,
  thumbnail_url text,
  default_theme_config jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Buat Tabel `invitations`
CREATE TABLE public.invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  template_id uuid REFERENCES public.templates ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')) NOT NULL,
  masa_aktif_mulai timestamp with time zone,
  masa_aktif_selesai timestamp with time zone,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Buat Tabel `wishes`
CREATE TABLE public.wishes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id uuid REFERENCES public.invitations ON DELETE CASCADE NOT NULL,
  nama_tamu text NOT NULL,
  pesan text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Buat Tabel `transactions`
CREATE TABLE public.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  invitation_id uuid REFERENCES public.invitations ON DELETE SET NULL,
  jumlah numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'settlement', 'expire', 'cancel')) NOT NULL,
  midtrans_order_id text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Trigger Otomatis Pembuatan Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Aktifkan Row Level Security (RLS) pada semua tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 8. Buat Kebijakan RLS (Policies)

-- POLICIES UNTUK `profiles`
CREATE POLICY "Pengguna dapat melihat profil mereka sendiri" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Pengguna dapat memperbarui profil sendiri" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admin memiliki akses penuh ke profil" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

-- POLICIES UNTUK `templates`
CREATE POLICY "Semua orang dapat melihat template aktif" ON public.templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Template admin dapat mengelola template" ON public.templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('template_admin', 'super_admin')
    )
  );

-- POLICIES UNTUK `invitations`
CREATE POLICY "Pengguna dapat mengelola undangan milik sendiri" ON public.invitations
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Publik dapat melihat undangan yang dipublikasikan" ON public.invitations
  FOR SELECT USING (status = 'published');

-- POLICIES UNTUK `wishes`
CREATE POLICY "Publik dapat melihat ucapan pada undangan" ON public.wishes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = wishes.invitation_id AND invitations.status = 'published'
    )
  );

CREATE POLICY "Siapa saja dapat mengirimkan ucapan" ON public.wishes
  FOR INSERT WITH CHECK (true);

-- POLICIES UNTUK `transactions`
CREATE POLICY "Pengguna dapat melihat riwayat transaksi mereka sendiri" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
