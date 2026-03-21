import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import type { MasterProfile } from "@/types/database";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("master_profiles")
    .select("user_id, profile, updated_at")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    const empty: MasterProfile = {
      user_id: auth.user.id,
      profile: {},
      updated_at: null,
    };
    return NextResponse.json(empty);
  }

  return NextResponse.json(data as MasterProfile);
}

export async function PUT(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("profile" in body) ||
    typeof (body as { profile: unknown }).profile !== "object" ||
    (body as { profile: unknown }).profile === null ||
    Array.isArray((body as { profile: unknown }).profile)
  ) {
    return NextResponse.json(
      { error: "Body must include a JSON object: { profile: { ... } }" },
      { status: 400 },
    );
  }

  const profile = (body as { profile: Record<string, unknown> }).profile;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("master_profiles")
    .upsert(
      { user_id: auth.user.id, profile },
      { onConflict: "user_id" },
    )
    .select("user_id, profile, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as MasterProfile);
}
