-- ==============================================================================
-- SCHEMA DATABASE PORTO-GURU (SMK TELKOM MALANG) UNTUK SUPABASE
-- Jalankan kode SQL ini di: Dashboard Supabase -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Tabel Profil Guru & Admin
CREATE TABLE IF NOT EXISTS public.guru_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nuptk_or_nip TEXT,
  jurusan TEXT DEFAULT 'RPL' CHECK (jurusan IN ('RPL', 'TKJ', 'PG', 'Normatif', 'Adaptif')),
  mapel TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  specializations TEXT[] DEFAULT '{}',
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('approved', 'pending', 'rejected')),
  validation_note TEXT,
  validated_by TEXT,
  validated_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Prestasi & Penghargaan
CREATE TABLE IF NOT EXISTS public.prestasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id UUID REFERENCES public.guru_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  level TEXT CHECK (level IN ('Sekolah', 'Kota/Kabupaten', 'Provinsi', 'Nasional', 'Internasional')),
  year TEXT NOT NULL,
  organizer TEXT NOT NULL,
  description TEXT,
  proof_file_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
  status_note TEXT,
  verified_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Sertifikasi Kompetensi
CREATE TABLE IF NOT EXISTS public.sertifikasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id UUID REFERENCES public.guru_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  year TEXT NOT NULL,
  credential_id TEXT,
  valid_until TEXT,
  proof_file_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
  status_note TEXT,
  verified_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Karya & Modul Pembelajaran
CREATE TABLE IF NOT EXISTS public.karya (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id UUID REFERENCES public.guru_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('Modul Ajar', 'Inovasi Pembelajaran', 'Aplikasi / Software', 'Media Interaktif', 'Publikasi / Jurnal')),
  year TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  proof_file_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
  status_note TEXT,
  verified_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabel Notifikasi Status (Pending, Verifikasi, Ditolak)
CREATE TABLE IF NOT EXISTS public.guru_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id UUID REFERENCES public.guru_profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('verified', 'pending', 'rejected')),
  item_type TEXT CHECK (item_type IN ('prestasi', 'sertifikasi', 'karya', 'portfolio')),
  item_id UUID,
  item_title TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  admin_note TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabel Tim Admin & Verifikator Khusus (Prestasi, Sertifikasi, Karya)
CREATE TABLE IF NOT EXISTS public.admin_validators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nuptk_or_nip TEXT,
  role_title TEXT NOT NULL,
  scope TEXT DEFAULT 'all' CHECK (scope IN ('all', 'prestasi', 'sertifikasi', 'karya')),
  is_active BOOLEAN DEFAULT true,
  added_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Pengaturan Row Level Security (RLS)
ALTER TABLE public.guru_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sertifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karya ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guru_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_validators ENABLE ROW LEVEL SECURITY;

-- Policy Publik: Semua orang dapat membaca profil, prestasi, sertifikasi & karya yang sudah diapprove
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.guru_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Public items are viewable by everyone" 
  ON public.prestasi FOR SELECT 
  USING (true);

CREATE POLICY "Public sertifikasi are viewable by everyone" 
  ON public.sertifikasi FOR SELECT 
  USING (true);

CREATE POLICY "Public karya are viewable by everyone" 
  ON public.karya FOR SELECT 
  USING (true);

-- Policy Admin Validators: Dapat dibaca oleh semua admin/publik
CREATE POLICY "Admin validators viewable" 
  ON public.admin_validators FOR SELECT 
  USING (true);

-- Policy Guru: Guru dapat mengupdate profil & item miliknya sendiri
CREATE POLICY "Users can update own profile" 
  ON public.guru_profiles FOR UPDATE 
  USING (auth.uid() = auth_user_id);

-- Policy Admin (chusni@smktelkom-mlg.sch.id): Memiliki akses penuh
CREATE POLICY "Admin full access" 
  ON public.guru_profiles FOR ALL 
  USING (auth.jwt() ->> 'email' = 'chusni@smktelkom-mlg.sch.id');

-- Insert Data Awal Tim Verifikator
INSERT INTO public.admin_validators (email, name, nuptk_or_nip, role_title, scope, added_by)
VALUES
  ('chusni@smktelkom-mlg.sch.id', 'M. Chusni Agus, M. Pd.', '198205142008011005', 'Kepala Penjaminan Mutu (Super Admin)', 'all', 'Sistem'),
  ('siti_aminah@smktelkom-mlg.sch.id', 'Dra. Siti Aminah, M.Pd.', '197803122005012003', 'Admin Verifikator Prestasi', 'prestasi', 'chusni@smktelkom-mlg.sch.id'),
  ('bambang_tri@smktelkom-mlg.sch.id', 'Ir. Bambang Trihatmodjo, M.T.', '198106202008121002', 'Admin Verifikator Sertifikasi', 'sertifikasi', 'chusni@smktelkom-mlg.sch.id'),
  ('achmad_fauzi@smktelkom-mlg.sch.id', 'Achmad Fauzi, S.Kom., M.Kom.', '198911042018011001', 'Admin Verifikator Karya & Modul', 'karya', 'chusni@smktelkom-mlg.sch.id')
ON CONFLICT (email) DO NOTHING;

-- Selesai!
