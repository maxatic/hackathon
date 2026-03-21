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
