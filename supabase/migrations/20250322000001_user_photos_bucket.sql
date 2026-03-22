-- Private bucket for user-uploaded CV photos. Paths: {clerk_user_id}/cv-photo.{ext}
-- Uploads/downloads use the Supabase service role from the Next.js server only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-photos',
  'user-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
