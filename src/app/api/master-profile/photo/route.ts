import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminClient } from "@/lib/supabase/server";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const supabase = createAdminClient();

  const { data: row } = await supabase
    .from("master_profiles")
    .select("profile")
    .eq("user_id", auth.userId)
    .maybeSingle();

  const profile = row?.profile as Record<string, unknown> | null;
  const storagePath =
    typeof profile?.photoStoragePath === "string"
      ? profile.photoStoragePath
      : null;

  if (!storagePath) {
    return NextResponse.json({ url: null });
  }

  const { data } = await supabase.storage
    .from("user-photos")
    .createSignedUrl(storagePath, 3600);

  return NextResponse.json({ url: data?.signedUrl ?? null });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Multipart form expected" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing 'file' field" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are accepted" }, { status: 400 });
  }
  if (file.size > MAX_PHOTO_SIZE) {
    return NextResponse.json({ error: "Photo too large (max 5 MB)" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const storagePath = `${auth.userId}/cv-photo.${ext}`;

  const supabase = createAdminClient();

  const { error: uploadErr } = await supabase.storage
    .from("user-photos")
    .upload(storagePath, buf, { contentType: file.type, upsert: true });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  // Save path in profile
  const { data: row } = await supabase
    .from("master_profiles")
    .select("profile")
    .eq("user_id", auth.userId)
    .maybeSingle();

  const existing = (row?.profile as Record<string, unknown>) ?? {};
  await supabase
    .from("master_profiles")
    .upsert(
      { user_id: auth.userId, profile: { ...existing, photoStoragePath: storagePath } },
      { onConflict: "user_id" },
    );

  const { data: urlData } = await supabase.storage
    .from("user-photos")
    .createSignedUrl(storagePath, 3600);

  return NextResponse.json({ url: urlData?.signedUrl ?? null });
}
