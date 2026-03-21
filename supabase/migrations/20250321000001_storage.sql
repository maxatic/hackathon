-- Private bucket for LaTeX-rendered PDFs. Object paths: {user_id}/{application_id}/...
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

create policy "Users read own PDFs"
  on storage.objects
  for select
  using (
    bucket_id = 'generated-pdfs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users upload own PDFs"
  on storage.objects
  for insert
  with check (
    bucket_id = 'generated-pdfs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own PDFs"
  on storage.objects
  for update
  using (
    bucket_id = 'generated-pdfs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own PDFs"
  on storage.objects
  for delete
  using (
    bucket_id = 'generated-pdfs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
