# Supabase setup for Syz

This app uses **Supabase for Postgres + Storage only**. Sign-in is **Clerk**, not Supabase Auth.

## 1. Create a project

1. Open [supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. **New project** → choose organization, name (e.g. `syz`), **region** (e.g. `Frankfurt (eu-central-1)`), set a **database password** and save it.
3. Wait until status is **Active**.

## 2. Add keys to `.env.local` (project root)

In the Supabase dashboard: **Project Settings** (gear) → **API**.

| Variable | Copy from |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (`https://….supabase.co`) — not a key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** key (`sb_secret_…`) on the new API keys page, *or* legacy **service_role** JWT under “Legacy anon, service_role” |

Do **not** commit `.env.local`. The **service_role** key must stay server-side only.

See also [`.env.example`](../.env.example) in the repo root.

## 3. Run the SQL (create tables + PDF bucket)

**SQL Editor** → **New query**.

1. Paste the full contents of [`migrations/20250321000000_init.sql`](./migrations/20250321000000_init.sql) → **Run**.
2. New query → paste [`migrations/20250321000001_storage.sql`](./migrations/20250321000001_storage.sql) → **Run**.

Alternatively, paste everything from [`setup_all.sql`](./setup_all.sql) once.

If you see errors like “already exists”, you already applied that part — use the upgrade file only if you migrated from an older schema (see `migrations/20250321000002_from_supabase_auth_to_clerk.sql`).

## 4. Verify

- **Table Editor**: you should see `master_profiles`, `applications`, `generated_documents`.
- **Storage** → **Buckets**: `generated-pdfs` (private).

## 5. Test the app

```bash
npm run dev
```

Sign in with Clerk, then open `/api/master-profile` in the browser. You should get JSON (empty profile is fine), not a 500.

## Clerk “keyless mode” / wrong keys

If the terminal says **keyless mode** or Clerk shows “missing keys” while `.env.local` is filled in:

1. Stop `npm run dev`.
2. Delete the **`.clerk/`** folder in the project root (Clerk regenerates it only in keyless/claim flows; it can cache keys that differ from `.env.local`).
3. Confirm `.env.local` has **both** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from **the same** Clerk application in the dashboard.
4. Run `rm -rf .next && npm run dev` again.

Do not commit `.clerk/` — it’s in `.gitignore`.

## What each piece does

| Piece | Role |
|-------|------|
| `master_profiles` | One JSON blob per user (Master CV). `user_id` = Clerk user id (text). |
| `applications` | Job applications per user. |
| `generated_documents` | CV / cover letter / bundle metadata + optional PDF path. |
| `generated-pdfs` bucket | PDF files uploaded by the server (paths like `{clerkUserId}/{applicationId}/...`). |
