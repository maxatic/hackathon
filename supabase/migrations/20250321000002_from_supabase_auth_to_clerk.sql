-- Run this ONLY if you already applied the old schema (uuid user_id + Supabase Auth FK + RLS).
-- Fresh installs should use 20250321000000_init.sql only.

-- Drop RLS policies
drop policy if exists "Users manage own master profile" on public.master_profiles;
drop policy if exists "Users manage own applications" on public.applications;
drop policy if exists "Users manage own generated documents" on public.generated_documents;

alter table public.master_profiles disable row level security;
alter table public.applications disable row level security;
alter table public.generated_documents disable row level security;

-- Drop FKs to auth.users
alter table public.master_profiles drop constraint if exists master_profiles_user_id_fkey;
alter table public.applications drop constraint if exists applications_user_id_fkey;
alter table public.generated_documents drop constraint if exists generated_documents_user_id_fkey;

-- UUID -> text (Clerk ids)
alter table public.master_profiles
  alter column user_id type text using user_id::text;

alter table public.applications
  alter column user_id type text using user_id::text;

alter table public.generated_documents
  alter column user_id type text using user_id::text;

-- Storage: remove Supabase Auth–based policies (if present)
drop policy if exists "Users read own PDFs" on storage.objects;
drop policy if exists "Users upload own PDFs" on storage.objects;
drop policy if exists "Users update own PDFs" on storage.objects;
drop policy if exists "Users delete own PDFs" on storage.objects;
