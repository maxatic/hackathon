-- Syz core schema: master profile, applications, generated documents
-- Requires: Supabase Auth (auth.users)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Master CV / profile (single row per user, flexible JSON)
-- ---------------------------------------------------------------------------
create table public.master_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index master_profiles_updated_at_idx on public.master_profiles (updated_at desc);

-- ---------------------------------------------------------------------------
-- Job applications
-- ---------------------------------------------------------------------------
create type public.application_status as enum (
  'draft',
  'applied',
  'interview',
  'offer',
  'rejected',
  'withdrawn'
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company text not null default '',
  role_title text not null default '',
  jd_text text not null default '',
  locale text not null default 'de' check (locale in ('de', 'en')),
  status public.application_status not null default 'draft',
  applied_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_created_idx on public.applications (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Generated CV / Anschreiben / PDF artifacts
-- ---------------------------------------------------------------------------
create type public.document_kind as enum ('cv', 'cover_letter', 'bundle');

create table public.generated_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  application_id uuid not null references public.applications (id) on delete cascade,
  kind public.document_kind not null,
  latex_source text,
  pdf_storage_path text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index generated_documents_application_idx
  on public.generated_documents (application_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.master_profiles enable row level security;
alter table public.applications enable row level security;
alter table public.generated_documents enable row level security;

-- master_profiles
create policy "Users manage own master profile"
  on public.master_profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- applications
create policy "Users manage own applications"
  on public.applications
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- generated_documents
create policy "Users manage own generated documents"
  on public.generated_documents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger applications_set_updated_at
  before update on public.applications
  for each row
  execute procedure public.set_updated_at();

create trigger master_profiles_set_updated_at
  before update on public.master_profiles
  for each row
  execute procedure public.set_updated_at();
