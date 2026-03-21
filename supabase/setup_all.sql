-- One-shot setup: same as running migrations in order.
-- Run this in Supabase SQL Editor, or use migrations/ files separately.

-- === Part 1: tables ===

-- Syz core schema: master profile, applications, generated documents
-- Auth: Clerk (user ids are text, e.g. user_xxx). API uses service role + userId filter.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Master CV / profile (single row per user, flexible JSON)
-- ---------------------------------------------------------------------------
create table public.master_profiles (
  user_id text primary key,
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
  user_id text not null,
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
  user_id text not null,
  application_id uuid not null references public.applications (id) on delete cascade,
  kind public.document_kind not null,
  latex_source text,
  pdf_storage_path text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index generated_documents_application_idx
  on public.generated_documents (application_id, created_at desc);

-- RLS off: access only via server-side service role with explicit user_id filter.

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

-- === Part 2: storage bucket ===

-- Private bucket for LaTeX-rendered PDFs. Paths: {clerk_user_id}/{application_id}/...
-- Uploads/downloads use the Supabase service role from the Next.js server only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'generated-pdfs',
  'generated-pdfs',
  false,
  52428800,
  array['application/pdf']::text[]
)
on conflict (id) do update
set file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
